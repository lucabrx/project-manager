import { create } from 'zustand';

type CreateWorkspaceModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCreateWorkspaceModal = create<CreateWorkspaceModalState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
