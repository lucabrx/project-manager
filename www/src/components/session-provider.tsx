'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useProjects } from '~/hooks/use-projects';
import { TUser, TWorkspaceResponse } from '~/lib/types';
import { useCreateProjectModal } from '~/store/create-project-modal.store';
import { useCreateWorkspaceModal } from '~/store/create-workspace-modal.store';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
import { CreateProject } from './modals/create-project';
import { CreateWorkspace } from './modals/create-workspace';

export function SessionProvider({
  user,
  workspaces,
  authToken,
  children,
}: {
  user: TUser;
  workspaces: TWorkspaceResponse[];
  authToken: string;
  children: React.ReactNode;
}) {
  const { isOpen: isOpenWorkspace } = useCreateWorkspaceModal();
  const { isOpen: isOpenProject } = useCreateProjectModal();
  const pathname = usePathname();
  const searchQuery = useSearchParams();
  const router = useRouter();
  const { data: projects, isPending } = useProjects();

  useEffect(() => {
    useSession.setState({ user, authToken });
    useWorkspace.setState({ workspaces, selectedWorkspace: workspaces[0] });
  }, [user, workspaces]);

  useEffect(() => {
    if (isPending) return;

    if (!projects?.length) {
      void router.push('/dashboard');
      return;
    }

    if (projects) {
      const project = projects.find((project) => {
        const projectId = searchQuery.get('project');
        return projectId ? project.id === +projectId : false;
      });

      if (!project) {
        void router.push(`/dashboard?project=${projects[0].id}`);
        return;
      }
    }
    if (
      projects &&
      pathname === '/dashboard' &&
      !searchQuery.get('project') &&
      projects.length > 0
    ) {
      void router.push(`/dashboard?project=${projects[0].id}`);
    }
  }, [projects]);

  return (
    <>
      {isOpenWorkspace && <CreateWorkspace />}
      {isOpenProject && <CreateProject />}
      {children}
    </>
  );
}
