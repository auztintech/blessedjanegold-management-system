import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const ACCESS_TOKEN_COOKIE = "APP_ACCESS_TOKEN";
export const REFRESH_TOKEN_COOKIE = "APP_REFRESH_TOKEN";
export const ROLE_COOKIE = "APP_USER_ROLE";

export type Role = "SUPER_ADMIN" | "SALES_PERSON" | "WAREHOUSE_KEEPER";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  phone_number: string;
  is_active: boolean;
  date_joined: string;
}

interface SignInParams {
  user: User;
  access: string;
  refresh: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (params: SignInParams) => void;
  signOut: () => void;
}

const cookieOptions = {
  sameSite: "Lax" as const,
  secure: process.env.NODE_ENV !== "development",
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: ({ user, access, refresh }) => {
        set({ user, isAuthenticated: true });
        Cookies.set(ACCESS_TOKEN_COOKIE, access, {
          ...cookieOptions,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
        });
        Cookies.set(REFRESH_TOKEN_COOKIE, refresh, {
          ...cookieOptions,
          expires: 7,
        });
        Cookies.set(ROLE_COOKIE, user.role, cookieOptions);
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false });
        Cookies.remove(ACCESS_TOKEN_COOKIE);
        Cookies.remove(REFRESH_TOKEN_COOKIE);
        Cookies.remove(ROLE_COOKIE);
      },
    }),
    { name: "app-user-store", skipHydration: true }
  )
);