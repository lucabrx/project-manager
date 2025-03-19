import { create } from 'zustand';

type WorkspaceState = {
  workspaces: string[];
  addWorkspace: (workspace: string) => void;
  removeWorkspace: (workspace: string) => void;
  setWorkspaces: (workspaces: string[]) => void;
  selectWorkspace: (workspace: string) => void;
  selectedWorkspace: string;
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
  selectedWorkspace: '',
}));
