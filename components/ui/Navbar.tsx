"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <nav className="border-b border-border bg-background px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 hover:opacity-80 transition"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-foreground tracking-tight">
          TaskFlow
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition outline-none">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground font-medium hidden sm:block">
                {user?.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}