'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import * as z from 'zod';
import { authApi, uploadImage } from '~/lib/api';
import { TWorkspaceResponse } from '~/lib/types';
import { useCreateWorkspaceModal } from '~/store/create-workspace-modal.store';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
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

export function CreateWorkspace() {
  const { authToken } = useSession();
  const { addWorkspace, selectWorkspace } = useWorkspace();
  const api = authApi(authToken);
  const { close, isOpen } = useCreateWorkspaceModal();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['create workspace'],
    mutationFn: (data: {
      name: string;
      description: string | undefined;
      logo: string | undefined;
    }) => api.post('workspace', { json: data }).json<TWorkspaceResponse>(),
    onSuccess: (data) => {
      addWorkspace(data);
      selectWorkspace(data);
      reset();
      close();
      setFile(null);
      setIsLoading(false);
    },
  });

  const { Field, reset, handleSubmit } = useForm({
    onSubmit: async (data) => {
      setIsLoading(true);
      const img = await uploadImage({
        file,
        authToken,
      });
      const payload = {
        name: data.value.name,
        description: data.value.description,
        logo: img,
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
    isOpen && (
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
                  <ErrorMessage
                    message={field.state.meta.errors[0]?.message!}
                  />
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
            <Label>Logo</Label>
            {file ? (
              <div className="relative flex w-fit items-center gap-4">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Workspace Logo"
                  className="h-32 w-32 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  onClick={() => setFile(null)}
                  variant="destructive"
                  className="absolute top-0 right-0"
                  size="icon"
                >
                  <Icon
                    icon="solar:trash-bin-minimalistic-2-broken"
                    className="size-5"
                  />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="bg-muted/20 hover:bg-muted flex aspect-square h-32 w-fit cursor-pointer items-center justify-center gap-4 rounded-lg border border-dashed p-4 transition-colors duration-200 ease-in-out"
              >
                <Icon icon="bi:plus" className="size-10" />
              </button>
            )}
          </div>
          <div className="mt-4 flex w-full items-center justify-end">
            <Button disabled={isLoading} type="submit">
              <Icon
                icon="solar:pen-new-square-broken"
                className="mr-2 size-5"
              />
              Create
            </Button>
          </div>
        </form>
        <input
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          type="file"
          ref={uploadInputRef}
          className="hidden"
        />
      </Modal>
    )
  );
}
