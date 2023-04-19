import { create } from 'zustand';

const useUserStore = create((set) => ({
  currentUser: null,
  authReady: false,
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  setAuthReady: (isReady) => {
    set({ authReady: isReady });
  },
}));

export default useUserStore;
