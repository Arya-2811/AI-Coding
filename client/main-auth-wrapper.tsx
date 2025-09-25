import { PropsWithChildren } from "react";
import { AuthProvider } from "@/services/auth-context";

export default function WithAuth({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
