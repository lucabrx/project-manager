'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '~/components/ui/sidebar';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useWorkspace } from '~/store/workspace.store';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useCreateWorkspaceModal } from '~/store/create-workspace-modal.store';

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { workspaces, selectedWorkspace, selectWorkspace } = useWorkspace();
  const { open } = useCreateWorkspaceModal();

  return !workspaces.length ? (
    <div className="p-4">
      <Button onClick={open} variant="secondary" className="w-full">
        <Icon icon="bi:plus" className="mr-2 size-5" />
        Create Workspace
      </Button>
    </div>
  ) : (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {selectedWorkspace?.workspace.logo ? (
                  <Image
                    width={32}
                    height={32}
                    src={selectedWorkspace?.workspace.logo}
                    alt={selectedWorkspace?.workspace.name!}
                  />
                ) : (
                  <Icon icon="bi:grid-1x2-fill" className="size-5" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedWorkspace?.workspace.name}
                </span>
              </div>
              <Icon
                icon="solar:alt-arrow-right-broken"
                className="ml-auto size-4"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((w) => (
              <DropdownMenuItem
                key={w.workspace.id}
                className="gap-2 p-2"
                onClick={() => selectWorkspace(w)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {w.workspace.logo ? (
                    <Image
                      width={32}
                      height={32}
                      src={w.workspace.logo}
                      alt={w.workspace.name}
                      className="rounded-md"
                    />
                  ) : (
                    <Icon icon="bi:grid-1x2-fill" className="size-5" />
                  )}
                </div>
                {w.workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Icon icon="bi:plus" className="size-5" />
              </div>
              <div onClick={open} className="text-muted-foreground font-medium">
                Create a new workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
