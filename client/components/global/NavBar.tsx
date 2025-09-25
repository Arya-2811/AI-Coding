import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
    </Link>
  );
};

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-md bg-gradient-to-br from-primary to-indigo-500" />
          <span className="text-lg font-bold tracking-tight">CodePilot AI</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/" label="Home" />
          <NavLink to="/dashboard" label="Dashboard" />
        </nav>
      </div>
    </header>
  );
}
