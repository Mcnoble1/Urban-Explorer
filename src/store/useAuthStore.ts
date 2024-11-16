import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
}

// Mock database of users
interface UserDB {
  [email: string]: {
    id: string;
    email: string;
    name: string;
    password: string;
    avatar?: string;
    bio?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: UserDB;
  login: (email: string, password: string) => Promise<User>;
  register: (user: { email: string; password: string; name: string }) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: {},
      login: async (email: string, password: string) => {
        const users = get().users;
        const user = users[email];

        if (!user || user.password !== password) {
          throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({ user: userWithoutPassword, isAuthenticated: true });
        return userWithoutPassword;
      },
      register: async ({ email, password, name }) => {
        const users = get().users;
        
        if (users[email]) {
          throw new Error('Email already registered');
        }

        const newUser = {
          id: crypto.randomUUID(),
          email,
          password,
          name,
        };

        set(state => ({
          users: {
            ...state.users,
            [email]: newUser,
          },
        }));

        const { password: _, ...userWithoutPassword } = newUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
        return userWithoutPassword;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (user) => {
        set(state => ({
          user,
          users: {
            ...state.users,
            [user.email]: {
              ...state.users[user.email],
              ...user,
            },
          },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);