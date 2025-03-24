import { create } from 'zustand';

type CreateTasktModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useTaskModal = create<CreateTasktModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
