import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { authApi } from '~/lib/api';
import { useTaskModal } from '~/store/create-task-modal.store';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
import { Button } from '../ui/button';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().default('todo'),
  priority: z.string().default('low'),
  assigneeUserId: z.number().optional(),
  dueDate: z.date().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function CreateTask() {
  const { close } = useTaskModal();
  const { authToken } = useSession();
  const { selectedWorkspace } = useWorkspace();
  const api = authApi(authToken);
  const searchParams = useSearchParams().get('project');

  if (!selectedWorkspace || !searchParams) return null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
    },
  });

  const { mutate } = useMutation({
    mutationKey: ['createTask'],
    onMutate: async (data: TaskFormValues) =>
      api
        .post(
          `task/workspace/${selectedWorkspace?.id}/project/${searchParams}`,
          { json: data },
        )
        .json(),
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    await mutate(data);
    close();
  };

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  return (
    <Modal onClose={close} className="p-0">
      <h2 className="mb-4 px-8 pt-8 text-xl font-semibold">Create Issue</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2 px-8">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Issue title"
            {...register('title')}
            autoFocus
          />
          {errors.title?.message && (
            <ErrorMessage message={errors.title.message} />
          )}
        </div>

        <div className="grid gap-2 px-8">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Add description..."
            {...register('description')}
            className="h-24 w-full resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="grid gap-2 pl-8">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid gap-2 pr-8">
            <Label htmlFor="priority">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="border-border flex justify-end gap-2 border-t p-4">
          <Button type="submit">Create Issue</Button>
        </div>
      </form>
    </Modal>
  );
}
