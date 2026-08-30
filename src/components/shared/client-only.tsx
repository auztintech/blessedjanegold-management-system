"use client";

import { useEffect, useState } from "react";

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount-detection guard for SSR/CSR parity
  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
