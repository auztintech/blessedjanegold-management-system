"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";

interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      await instance.post(endpoints().user.changePassword, payload);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) => {
      const data = error?.response?.data;
      const firstError = data ? Object.values(data)[0] : null;
      const message = Array.isArray(firstError)
        ? firstError[0]
        : firstError || "Failed to change password";
      toast.error(message as string);
    },
  });
}
