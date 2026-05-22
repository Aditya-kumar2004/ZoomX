"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useRequireAuth() {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [ready, isAuthenticated, router]);
}
