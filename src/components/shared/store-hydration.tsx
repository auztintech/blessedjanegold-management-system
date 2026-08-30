"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/z-store/user";

export function StoreHydration() {
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  return null;
}
