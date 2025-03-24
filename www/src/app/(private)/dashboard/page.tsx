'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useSearchParams } from 'next/navigation';
import { AppSidebar } from '~/components/sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { useProjects } from '~/hooks/use-projects';
import { useCreateProjectModal } from '~/store/create-project-modal.store';
import { useCreateWorkspaceModal } from '~/store/create-workspace-modal.store';
import { useWorkspace } from '~/store/workspace.store';

export default function Page() {
  const { workspaces, selectedWorkspace } = useWorkspace();
  const { open: openWorkspace } = useCreateWorkspaceModal();
  const { open: openProject } = useCreateProjectModal();
  const { data: projects, isSuccess } = useProjects();
  const searchParams = useSearchParams().get('project');
  const project =
    isSuccess &&
    projects?.find((project) => project.id === (searchParams && +searchParams));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {selectedWorkspace && (
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      <span className="truncate">
                        {selectedWorkspace.workspace.name}
                      </span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {selectedWorkspace && project && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
                {project && (
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {<span className="truncate">{project.name}</span>}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {!workspaces.length ? (
          <div>
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Icon
                  icon="hugeicons:file-not-found"
                  className="text-muted-foreground size-16"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold">No workspaces</p>
                  <p className="text-muted-foreground">
                    Create a workspace to get started Create a workspace to get
                    started building your application.
                  </p>
                </div>
                <Button onClick={openWorkspace}>
                  <Icon
                    icon="solar:pen-new-square-broken"
                    className="mr-2 size-5"
                  />
                  Create Workspace
                </Button>
              </div>
            </div>
          </div>
        ) : !projects?.length ? (
          <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Icon
                icon="solar:file-smile-broken"
                className="text-muted-foreground size-16"
              />
              <div className="text-center">
                <p className="text-lg font-semibold">No projects</p>
                <p className="text-muted-foreground">
                  Create a project to get started.
                </p>
              </div>
              <Button onClick={openProject}>
                <Icon
                  icon="solar:pen-new-square-broken"
                  className="mr-2 size-5"
                />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1">Hello World</div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
