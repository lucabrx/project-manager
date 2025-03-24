'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { useProjects } from '~/hooks/use-projects';
import { cn } from '~/lib/utils';
import { useCreateProjectModal } from '~/store/create-project-modal.store';

export function NavProjects() {
  const { open } = useCreateProjectModal();
  const { data: projects } = useProjects();
  const router = useRouter();
  const projectParam = useSearchParams().get('project');

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <button
                className={cn(
                  projectParam &&
                    +projectParam === item.id &&
                    'bg-sidebar-accent',
                )}
                onClick={() => router.push(`/dashboard?project=${item.id}`)}
              >
                <Icon
                  className="mr-2"
                  icon={item.icon !== '' ? item.icon : 'solar:folder-broken'}
                />
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={open}
            className="text-sidebar-foreground/70"
          >
            <Icon className="mr-2" icon="eva:plus-outline" />
            <span>Create Project</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
