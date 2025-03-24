import { create } from 'zustand';
import { TWorkspaceResponse } from '~/lib/types';

type WorkspaceState = {
  workspaces: TWorkspaceResponse[];
  addWorkspace: (workspace: TWorkspaceResponse) => void;
  removeWorkspace: (workspace: TWorkspaceResponse) => void;
  setWorkspaces: (workspaces: TWorkspaceResponse[]) => void;
  selectWorkspace: (workspace: TWorkspaceResponse) => void;
  selectedWorkspace: TWorkspaceResponse | null;
};

export const useWorkspace = create<WorkspaceState>((set) => ({
  workspaces: [],
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),
  removeWorkspace: (workspace) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w !== workspace),
    })),
  setWorkspaces: (workspaces) => set({ workspaces }),
  selectWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
  selectedWorkspace: null,
}));
