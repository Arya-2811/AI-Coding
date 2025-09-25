import { PropsWithChildren } from "react";
import { useAuth } from "./auth-context";
import type { Role } from "./auth";

export function RoleGate({ roles, children }: PropsWithChildren<{ roles: Role[] }>) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
