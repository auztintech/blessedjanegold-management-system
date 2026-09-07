"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { instance } from "@/utils/axios";
import { endpoints } from "@/config/endpoints";
import { PaginatedResponse } from "@/types/api";
import { User, Role } from "@/store/z-store/user";

// GUESS — confirm exact fields against UserCreate schema in Swagger
export interface CreateUserPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  role: Role;
}

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<User>>(
        endpoints().user.list,
        {
          params: { page },
        }
      );
      return data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const { data } = await instance.post<User>(
        endpoints().user.list,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) => {
      // DRF validation errors usually come back as { field_name: ["error"] }
      const data = error?.response?.data;
      const firstError = data ? Object.values(data)[0] : null;
      const message = Array.isArray(firstError)
        ? firstError[0]
        : firstError || "Failed to create user";
      toast.error(message as string);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(endpoints(id).user.detail);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User removed");
    },
    onError: () => toast.error("Failed to remove user"),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateUserPayload>;
    }) => {
      const { data } = await instance.patch<User>(
        endpoints(id).user.detail,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: AxiosError<Record<string, string[] | string>>) => {
      const data = error?.response?.data;
      const firstError = data ? Object.values(data)[0] : null;
      const message = Array.isArray(firstError)
        ? firstError[0]
        : firstError || "Failed to update user";
      toast.error(message as string);
    },
  });
}

export function useUsersByRole(role: Role) {
  return useQuery({
    queryKey: ["users-by-role", role],
    queryFn: async () => {
      const { data } = await instance.get<PaginatedResponse<User>>(
        endpoints().user.list,
        {
          params: { role },
        }
      );
      return data.results;
    },
  });
}