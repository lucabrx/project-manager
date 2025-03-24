import { create } from 'zustand';

type CreateProjectModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useCreateProjectModal = create<CreateProjectModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
