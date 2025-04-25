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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTasks } from '~/hooks/use-tasks';
import { authApi } from '~/lib/api';
import { TTask } from '~/lib/types';
import { useTaskModal } from '~/store/create-task-modal.store';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
import { Button } from './ui/button';

export async function updateTask(
  taskId: string,
  payload: TTask,
  authToken: string,
  workspaceId: number,
) {
  const response = await authApi(authToken).patch(
    `task/${taskId}/workspace/${workspaceId}`,
    {
      json: payload,
    },
  );
  return response;
}

interface ColumnItem {
  id: string;
  label: string;
  task: TTask;
}

interface DraggableItem extends ColumnItem {
  group: string;
}

type ColumnGroup = Record<string, ColumnItem[]>;

const statusMap = {
  backlog: 'backlog',
  todo: 'todo',
  in_progress: 'in_progress',
  done: 'done',
};

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

const MemoizedSortableItem = React.memo(function SortableItem({
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
      className="bg-accent border-border group relative rounded-lg px-4 py-2 shadow-sm"
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
          className="w-full cursor-text bg-transparent outline-none"
        />
      ) : (
        <div className="cursor-grab">
          <div className="flex items-center justify-between">
            <div {...listeners} {...attributes} className="font-medium">
              {label}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEditStart();
              }}
              variant="ghost"
              size="icon"
            >
              <Icon icon="akar-icons:edit" className="size-4" />
            </Button>
          </div>
          {item.task.assignee && (
            <div className="text-sm text-gray-500">
              Assignee: {item.task.assignee.name}
            </div>
          )}
          {item.task.priority && (
            <div className="text-sm text-gray-500">
              Priority: {item.task.priority}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

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
        <h2 className="text-lg font-semibold capitalize">
          {columnId.replace('_', ' ')}
        </h2>
        <Button onClick={open} variant="ghost" size="icon">
          <Icon icon="akar-icons:plus" />
        </Button>
      </div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <MemoizedSortableItem
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

export function Kanban() {
  const { authToken } = useSession();
  const { selectedWorkspace } = useWorkspace();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();
  const [columns, setColumns] = useState<ColumnGroup>({
    backlog: [],
    todo: [],
    in_progress: [],
    done: [],
  });
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const allTasks = data.pages.flatMap((page) => page.content);

      const newColumns: ColumnGroup = {
        backlog: [],
        todo: [],
        in_progress: [],
        done: [],
      };

      allTasks.forEach((task) => {
        const status = task.status as keyof typeof statusMap;
        if (newColumns[status]) {
          newColumns[status].push({
            id: task.id.toString(),
            label: task.title,
            task,
          });
        }
      });

      setColumns(newColumns);
    }
  }, [data]);

  const [activeItem, setActiveItem] = useState<DraggableItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const { group, item } = active.data.current as {
      group: string;
      item: ColumnItem;
    };
    setActiveItem({ ...item, group });
  }, []);

  const debouncedUpdateTask = useMemo(
    () =>
      async (
        taskId: string,
        payload: TTask,
        authToken: string,
        workspaceId: number,
      ) => {
        try {
          await updateTask(taskId, payload, authToken, workspaceId);
        } catch (error) {
          console.error('Failed to update task status:', error);
        }
      },

    [],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
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
          const oldIndex = sourceItems.findIndex(
            (item) => item.id === active.id,
          );
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

        const task = columns[sourceGroup].find(
          (item) => item.id === active.id.toString(),
        )?.task;

        if (task) {
          const updatedTask = {
            ...task,
            status: destinationGroup,
          };
          debouncedUpdateTask(
            active.id.toString(),
            updatedTask,
            authToken,
            selectedWorkspace?.id!,
          );
        }
      }
    },
    [columns, authToken, selectedWorkspace, debouncedUpdateTask],
  );

  const handleDragCancel = useCallback(() => {
    setActiveItem(null);
  }, []);

  const handleAddItem = useCallback((columnId: string) => {
    const newItem = {
      id: `new-${Date.now()}`,
      label: 'New Task',
      task: {
        id: Date.now(),
        title: 'New Task',
        status: columnId,
      } as TTask,
    };
    setColumns((prev) => ({
      ...prev,
      [columnId]: [...prev[columnId], newItem],
    }));
    setEditingItemId(newItem.id);
  }, []);

  const handleEditItem = useCallback(
    async (itemId: string, newLabel: string) => {
      const currentColumnId = Object.keys(columns).find((key) =>
        columns[key].some((item) => item.id === itemId),
      );

      if (!currentColumnId) return;

      setColumns((prev) => ({
        ...prev,
        [currentColumnId]: prev[currentColumnId].map((item) =>
          item.id === itemId ? { ...item, label: newLabel } : item,
        ),
      }));

      const task = columns[currentColumnId].find(
        (item) => item.id === itemId,
      )?.task;
      if (task) {
        const payload = { ...task, title: newLabel };
        try {
          await updateTask(itemId, payload, authToken, selectedWorkspace?.id!);
        } catch (error) {
          setColumns((prev) => ({
            ...prev,
            [currentColumnId]: prev[currentColumnId].map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    label:
                      columns[currentColumnId].find((i) => i.id === itemId)
                        ?.task?.title || '',
                  }
                : item,
            ),
          }));
        }
      }
    },
    [columns, authToken, selectedWorkspace],
  );

  return (
    <div className="flex flex-col">
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
              onEditItem={(id, newLabel) => handleEditItem(id, newLabel)}
              editingItemId={editingItemId}
              onEditStart={(itemId) => setEditingItemId(itemId)}
              onEditEnd={() => setEditingItemId(null)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeItem && (
            <MemoizedSortableItem
              id={activeItem.id}
              label={activeItem.label}
              group={activeItem.group}
              item={activeItem}
              onEditItem={(newLabel) => handleEditItem(activeItem.id, newLabel)}
              onEditEnd={() => setEditingItemId(null)}
              editingItemId={editingItemId}
              onEditStart={() => setEditingItemId(activeItem.id)}
            />
          )}
        </DragOverlay>
      </DndContext>
      <div ref={ref} className="h-1 w-full">
        {isFetchingNextPage && <div>Loading more tasks...</div>}
      </div>
    </div>
  );
}
