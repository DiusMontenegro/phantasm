"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu, Search, X } from "lucide-react";
import { DashboardThemeToggle } from "@/components/dashboard-theme-toggle";

export function DashboardHeader({
  sidebarOpen,
  onToggleSidebar,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const isChat = pathname === "/dashboard/chat" || pathname.startsWith("/dashboard/chat/");

  return (
    <header className="dashboard-header">
      <button
        className="dashboard-sidebar-toggle"
        type="button"
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <Link className="dashboard-mobile-brand" href="/dashboard">
        <span className="dashboard-brand-mark">P</span>
        PHANTASM
      </Link>
      {!isChat && (
        <form className="dashboard-search" action="/dashboard" role="search">
          <Search size={17} aria-hidden="true" />
          <label className="sr-only" htmlFor="dashboard-search">
            Search videos
          </label>
          <input
            id="dashboard-search"
            name="q"
            type="search"
            placeholder="Search videos"
            autoComplete="off"
          />
        </form>
      )}
      <div className="dashboard-header-actions">
        <DashboardThemeToggle />
        <UserButton />
      </div>
    </header>
  );
}
