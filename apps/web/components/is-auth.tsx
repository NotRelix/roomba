"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@repo/ui/hooks/auth";

export function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        return router.replace("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return <Component {...props} />;
  };
}

export function isNotAuth(Component: any) {
  return function IsAuth(props: any) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (isAuthenticated) {
        return router.replace("/");
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated) return null;

    return <Component {...props} />;
  };
}
