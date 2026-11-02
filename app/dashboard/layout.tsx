import type { ReactNode } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  Compass,
  MessageSquareText,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { DashboardThemeToggle } from "@/components/dashboard-theme-toggle";

const navigation = [
  { label: "Discover", href: "/dashboard", icon: Compass },
  { label: "Watch", href: "/dashboard#watch", icon: Play },
  { label: "AI Search", href: "/dashboard#search", icon: Search },
  { label: "AI Chat", href: "/dashboard#chat", icon: MessageSquareText },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" href="/dashboard">
          <span className="dashboard-brand-mark">P</span>
          <span>PHANTASM</span>
        </Link>

        <nav className="dashboard-navigation" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link className="dashboard-nav-item" href={item.href} key={item.label}>
                <Icon size={18} strokeWidth={1.7} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar-note">
          <Sparkles size={16} />
          <div>
            <span>AI workspace</span>
            <strong>Ready</strong>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <Link className="dashboard-mobile-brand" href="/dashboard">
            <span className="dashboard-brand-mark">P</span>
            PHANTASM
          </Link>
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
          <div className="dashboard-header-actions">
            <DashboardThemeToggle />
            <UserButton />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
