"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId="902405653902-8rik7sfkdv75jip7etd92rg85mqlm2a4.apps.googleusercontent.com">
        <AuthProvider>
          {children}
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1A1A26",
                border: "1px solid #1E1E2E",
                color: "#F0F0FF",
              },
            }}
          />
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
