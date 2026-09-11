"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { instance } from "@/utils/axios";
import { useUserStore, User, Role } from "@/store/z-store/user";
import { toast } from "sonner";
import { endpoints } from "@/config/endpoints";

interface LoginPayload {
  username: string;
  password: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

const roleRedirects: Record<Role, string> = {
  SUPER_ADMIN: "/dashboard",
  SALES_PERSON: "/sales/dashboard",
  WAREHOUSE_KEEPER: "/warehouse/dashboard",
};

export function useLogin() {
  const router = useRouter();
  const signIn = useUserStore((state) => state.signIn);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      // Step 1: authenticate — returns tokens only, no user data
      const { data: tokens } = await instance.post<TokenResponse>(
        endpoints().user.login,
        payload
      );

      // Step 2: fetch the actual profile using the fresh access token.
      // Passed explicitly here since the cookie isn't set yet at this point.
      const { data: user } = await instance.get<User>(endpoints().user.me, {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });

      return { user, ...tokens };
    },
    // onSuccess: ({ user, access, refresh }) => {
    //   signIn({ user, access, refresh });
    //   const displayName =
    //     [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    //     user.username;
    //   toast.success(`Welcome back, ${displayName}`);
    //   router.push(roleRedirects[user.role] ?? "/auth/login");
    // },
    onSuccess: ({ user, access, refresh }) => {
      console.log("========== LOGIN SUCCESS ==========");
      console.log("USER:", user);
      console.log("USER ROLE:", user.role);
      console.log("REDIRECT:", roleRedirects[user.role] ?? "/auth/login");
      console.log("===================================");

      signIn({ user, access, refresh });

      const displayName =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username;

      toast.success(`Welcome back, ${displayName}`);

      router.push(roleRedirects[user.role] ?? "/auth/login");
    },
    onError: (error: AxiosError<{ detail?: string; message?: string }>) => {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid username or password";
      toast.error(message);
    },
  });
}
