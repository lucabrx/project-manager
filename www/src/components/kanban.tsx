import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  rectIntersection,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import { useIssues } from '~/hooks/use-issues';
import { useTaskModal } from '~/store/create-task-modal.store';
import { Button } from './ui/button';

interface ColumnItem {
  id: string;
  label: string;
}

interface DraggableItem extends ColumnItem {
  group: string;
}

type ColumnGroup = Record<string, ColumnItem[]>;

const moveItemBetweenGroups = (
  source: ColumnGroup,
  destination: ColumnGroup,
  sourceId: string,
  destinationId: string,
  itemId: string,
) => {
  const sourceGroup = [...source[sourceId]];
  const destinationGroup = [...destination[destinationId]];
  const itemIndex = sourceGroup.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) return source;
  const [movedItem] = sourceGroup.splice(itemIndex, 1);
  destinationGroup.push(movedItem);
  return {
    ...source,
    [sourceId]: sourceGroup,
    [destinationId]: destinationGroup,
  };
};

function Column({
  columnId,
  items,
  onAddItem,
  onEditItem,
  editingItemId,
  onEditStart,
  onEditEnd,
}: {
  columnId: string;
  items: ColumnItem[];
  onAddItem: () => void;
  onEditItem: (itemId: string, newLabel: string) => void;
  editingItemId: string | null;
  onEditStart: (itemId: string) => void;
  onEditEnd: () => void;
}) {
  const { setNodeRef } = useDroppable({
    id: `droppable-${columnId}`,
    data: {
      columnId,
    },
  });
  const { open } = useTaskModal();

  return (
    <div
      ref={setNodeRef}
      className="border-border bg-card h-fit w-72 flex-shrink-0 rounded-lg border p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">{columnId}</h2>
        <Button onClick={open} variant="ghost" size="icon">
          <Icon icon="akar-icons:plus" />
        </Button>
      </div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              label={item.label}
              group={columnId}
              item={item}
              onEditItem={(newLabel) => onEditItem(item.id, newLabel)}
              onEditEnd={onEditEnd}
              editingItemId={editingItemId}
              onEditStart={() => onEditStart(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableItem({
  id,
  label,
  group,
  item,
  onEditItem,
  editingItemId,
  onEditStart,
  onEditEnd,
}: {
  id: string;
  label: string;
  group: string;
  item: ColumnItem;
  onEditItem: (newLabel: string) => void;
  editingItemId: string | null;
  onEditStart: () => void;
  onEditEnd: () => void;
}) {
  const [tempLabel, setTempLabel] = useState(label);
  const isEditing = editingItemId === id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { group, item },
      disabled: isEditing,
    });

  useEffect(() => {
    setTempLabel(label);
  }, [label]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEditItem(tempLabel);
      onEditEnd();
    } else if (e.key === 'Escape') {
      setTempLabel(label);
      onEditEnd();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      {...(!isEditing ? attributes : {})}
      {...(!isEditing ? listeners : {})}
      onDoubleClick={onEditStart}
      className="bg-accent border-border cursor-grab rounded-lg px-4 py-2 shadow-sm"
    >
      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={tempLabel}
          onChange={(e) => setTempLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            onEditItem(tempLabel);
            onEditEnd();
          }}
          className="w-full bg-transparent outline-none"
        />
      ) : (
        label
      )}
    </div>
  );
}

export function Kanban() {
  const { data } = useIssues();
  console.log(data);
  const [columns, setColumns] = useState<ColumnGroup>({
    todo: [
      { id: '1', label: 'Buy groceries 🛒' },
      { id: '2', label: 'Call the doctor 📞' },
    ],
    inProgress: [
      { id: '3', label: 'Read a book 📚' },
      { id: '4', label: 'Finish project task 👨‍💻' },
    ],
    done: [{ id: '5', label: 'Morning workout 🏋️‍♂️' }],
    backlog: [{ id: '6', label: 'Plan weekend trip 🚗' }],
  });

  const [activeItem, setActiveItem] = useState<DraggableItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { group, item } = active.data.current as {
      group: string;
      item: ColumnItem;
    };
    setActiveItem({ ...item, group });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const sourceGroup = (active.data.current as { group: string }).group;
    let destinationGroup: string;

    if (over.id.toString().startsWith('droppable-')) {
      destinationGroup = (over.data.current as { columnId: string }).columnId;
    } else {
      destinationGroup = (over.data.current as { group: string }).group;
    }

    if (sourceGroup === destinationGroup) {
      setColumns((prev) => {
        const sourceItems = prev[sourceGroup];
        const oldIndex = sourceItems.findIndex((item) => item.id === active.id);
        const newIndex = sourceItems.findIndex((item) => item.id === over.id);
        return {
          ...prev,
          [sourceGroup]: arrayMove(sourceItems, oldIndex, newIndex),
        };
      });
    } else {
      setColumns((prev) =>
        moveItemBetweenGroups(
          prev,
          prev,
          sourceGroup,
          destinationGroup,
          active.id.toString(),
        ),
      );
    }
  };

  const handleDragCancel = () => {
    setActiveItem(null);
  };

  const handleAddItem = (columnId: string) => {
    const newItem = {
      id: `new-${Date.now()}`,
      label: 'New Item',
    };
    setColumns((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newItem],
    }));
    setEditingItemId(newItem.id);
  };

  const handleEditItem = (
    columnId: string,
    itemId: string,
    newLabel: string,
  ) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((item) =>
        item.id === itemId ? { ...item, label: newLabel } : item,
      ),
    }));
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={rectIntersection}
    >
      <div className="flex gap-4 p-4">
        {Object.keys(columns).map((columnId) => (
          <Column
            key={columnId}
            columnId={columnId}
            items={columns[columnId]}
            onAddItem={() => handleAddItem(columnId)}
            onEditItem={(itemId, newLabel) =>
              handleEditItem(columnId, itemId, newLabel)
            }
            editingItemId={editingItemId}
            onEditStart={(itemId) => setEditingItemId(itemId)}
            onEditEnd={() => setEditingItemId(null)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <SortableItem
            id={activeItem.id}
            label={activeItem.label}
            group={activeItem.group}
            item={activeItem}
            onEditItem={() => {}}
            editingItemId={null}
            onEditStart={() => {}}
            onEditEnd={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
