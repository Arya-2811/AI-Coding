import { PropsWithChildren } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
