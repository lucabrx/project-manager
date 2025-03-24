import { create } from 'zustand';
import { TUser } from '~/lib/types';

type UserState = {
  user: TUser | null;
  setUser: (user: TUser) => void;
  authToken: string;
  setAuthToken: (token: string) => void;
};

export const useSession = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  authToken: '',
  setAuthToken: (token) => set({ authToken: token }),
}));
