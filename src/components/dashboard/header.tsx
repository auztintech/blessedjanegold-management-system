"use client";

import { Search, Bell, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/z-store/user";
import {
  Avatar, AvatarFallback, 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { KeyRound } from "lucide-react";
import { ChangePasswordSheet } from "@/components/shared/change-password-sheet";
import { ClientOnly } from "@/components/shared/client-only";

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SALES_PERSON: "Sales Person",
  WAREHOUSE_KEEPER: "Warehouse Keeper",
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const signOut = useUserStore((state) => state.signOut);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username;

  const initials = displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    signOut();
    router.push("/auth/login");
  };

  return (
    <header className="relative h-16 bg-white border-b border-gray-100 px-3 sm:px-6 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-600">
          <Menu size={20} />
        </button>

        <div className="hidden sm:block relative w-full max-w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button
          onClick={() => setMobileSearchOpen((p) => !p)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 text-gray-500">
          <Search size={18} />
        </button>
        <button className="hidden sm:flex relative w-9 h-9 items-center justify-center rounded-full hover:bg-gray-50 text-gray-500">
          <Bell size={18} />
        </button>
        <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-50 text-gray-500">
          <Settings size={18} />
        </button>

        <ClientOnly
          fallback={
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
            </div>
          }>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-orange-100 text-orange-600 text-sm font-medium">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {user ? roleLabel[user.role] : ""}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                <KeyRound size={14} className="mr-2" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-500 focus:text-red-500">
                <LogOut size={14} className="mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ClientOnly>
      </div>

      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-3 sm:hidden z-30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>
      )}

      <ChangePasswordSheet
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </header>
  );
}
