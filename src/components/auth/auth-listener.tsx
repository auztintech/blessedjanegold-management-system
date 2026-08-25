"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/z-store/user";
import { toast } from "sonner";

export function AuthListener() {
  const router = useRouter();
  const signOut = useUserStore((state) => state.signOut);

  useEffect(() => {
    const handleUnauthorized = () => {
      signOut();
      toast.error("Your session has expired. Please sign in again.");
      router.push("/auth/login");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [signOut, router]);

  return null;
}
