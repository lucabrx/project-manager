'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import * as z from 'zod';
import { authApi } from '~/lib/api';
import { TProject } from '~/lib/types';
import { useCreateProjectModal } from '~/store/create-project-modal.store';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
import { IconSelector } from '../icon-selector';
import { Button } from '../ui/button';
import { ErrorMessage } from '../ui/error-message';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(0),
});

type TCreateProject = {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
};

export function CreateProject() {
  const { authToken } = useSession();
  const { selectedWorkspace, workspaces } = useWorkspace();
  const api = authApi(authToken);
  const { close, isOpen } = useCreateProjectModal();
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#ffc642');
  const colorRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationKey: ['createProject'],
    mutationFn: (data: TCreateProject) => {
      if (!selectedWorkspace) {
        console.error('No workspace selected');
        return Promise.reject();
      }
      return api
        .post(`project/workspace/${selectedWorkspace.id}`, { json: data })
        .json<TProject>();
    },
    onSuccess: () => {
      reset();
      close();
    },
  });

  const { Field, reset, handleSubmit } = useForm({
    onSubmit: async (data) => {
      const payload: TCreateProject = {
        name: data.value.name,
        description: data.value.description,
        icon,
        color,
      };
      mutate(payload);
    },
    validators: {
      onChange: schema,
    },
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <Modal onClose={close} className="grid">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
      >
        <Field
          name="name"
          children={(field) => (
            <div className="mt-4 grid gap-4">
              <Label>Name</Label>
              <Input
                placeholder="Tyson's Gym"
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched &&
              field.state.meta.isBlurred &&
              field.state.meta.errors.length ? (
                <ErrorMessage message={field.state.meta.errors[0]?.message!} />
              ) : null}
            </div>
          )}
        />
        <Field
          name="description"
          children={(field) => (
            <div className="mt-4 grid gap-4">
              <Label>Description</Label>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Tyson's Gym description"
                className="h-32 resize-none"
              ></Textarea>
            </div>
          )}
        />

        <div className="mt-4 grid gap-4">
          <Label>Icon</Label>
          <IconSelector
            color={color}
            onSelect={(i) => {
              if (i === icon) {
                setIcon('');
                return;
              }
              setIcon(i);
            }}
            selectedIcon={icon}
          />
        </div>
        <div className="mt-4 grid gap-4">
          <Label>Color</Label>
          <input
            type="color"
            ref={colorRef}
            onChange={(e) => setColor(e.target.value)}
            className="hidden"
          />
          <div
            onClick={() => colorRef.current?.click()}
            className="border-border flex h-10 w-full cursor-pointer items-center justify-center rounded-md border p-2"
            style={{ backgroundColor: color }}
          ></div>
        </div>

        <div className="mt-4 flex w-full items-center justify-end">
          <Button type="submit">
            <Icon icon="solar:pen-new-square-broken" className="mr-2 size-5" />
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
