"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useTheme } from "next-themes";
import {
  CheckSquare,
  ChevronDown,
  LayoutDashboard,
  Languages,
  LogOut,
  Menu,
  Moon,
  Route,
  Settings2,
  Sparkles,
  Sun,
  Target,
  UserRound,
  Layers3,
  NotebookPen,
  PanelTop,
  CalendarRange,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
  session: Session;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: Sparkles },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/daily-log", label: "Daily Log", icon: NotebookPen },
  { href: "/weekly-review", label: "Weekly Review", icon: CheckSquare },
  { href: "/platforms", label: "Platforms", icon: PanelTop },
  { href: "/skills", label: "Skills", icon: Layers3 },
  { href: "/languages", label: "Languages", icon: Languages },
  { href: "/events", label: "Events", icon: CalendarRange },
  { href: "/routes", label: "Routes", icon: Route },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function DashboardShell({ children, session }: DashboardShellProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "AO";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#050816_0%,#070b14_55%,#050816_100%)] text-white">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-80 border-r border-white/10 bg-slate-950/96 px-5 py-6 transform-gpu transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-full flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-200 shadow-lg shadow-sky-950/20">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight text-white">
                    AscendOS
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Command center
                  </p>
                </div>
              </div>
              <Button
                className="lg:hidden"
                size="icon"
                variant="outline"
                onClick={() => setMobileOpen(false)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Current state
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.name ?? "Execution operator"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {user?.email ?? "Signed in"}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="border-white/10 bg-white/6 text-slate-200"
                >
                  {user?.role ?? "USER"}
                </Badge>
              </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "border-sky-400/20 bg-sky-400/10 text-white shadow-lg shadow-sky-950/20"
                        : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6 hover:text-white",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-sky-200" : "text-slate-500",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,165,233,0.14),rgba(15,23,42,0.95))] p-4">
              <p className="text-sm font-medium text-white">
                Sprint 1 foundation
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Onboarding, goals, and AI layers are intentionally deferred
                until the base execution shell is stable.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <Button
                className="lg:hidden"
                size="icon"
                variant="outline"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-400">
                <Search className="h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Command bar: search goals, logs, reviews, routes, or skills
                </span>
              </div>

              <Button
                className="hidden sm:inline-flex"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="icon"
                variant="outline"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button className="gap-3 px-3" variant="outline">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-semibold text-white">
                      {initials}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-sm font-medium text-white">
                        {user?.name ?? "Account"}
                      </span>
                      <span className="block text-xs text-slate-400">
                        {user?.role ?? "USER"}
                      </span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    className="z-50 min-w-56 rounded-2xl border border-white/10 bg-slate-950 p-2 text-white shadow-2xl shadow-black/40"
                    sideOffset={10}
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">
                        {user?.name ?? "Account"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {user?.email ?? "Signed in user"}
                      </p>
                    </div>
                    <DropdownMenu.Separator className="my-2 h-px bg-white/10" />
                    <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none hover:bg-white/6 hover:text-white">
                      <UserRound className="h-4 w-4" />
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 outline-none hover:bg-white/6 hover:text-white"
                      onSelect={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                      Toggle theme
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-2 h-px bg-white/10" />
                    <DropdownMenu.Item
                      className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-200 outline-none hover:bg-rose-500/10 hover:text-rose-100"
                      onSelect={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>

        {mobileOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
        ) : null}
      </div>
    </div>
  );
}
