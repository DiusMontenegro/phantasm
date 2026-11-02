"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  MessageSquareText,
  Play,
  Sparkles,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";

const navigation = [
  { label: "Discover", href: "/dashboard", icon: Compass },
  { label: "Watch", href: "/dashboard/watch", icon: Play },
  { label: "AI Chat", href: "/dashboard/chat", icon: MessageSquareText },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const isChat = pathname === "/dashboard/chat" || pathname.startsWith("/dashboard/chat/");

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className={`dashboard-shell${sidebarOpen ? " dashboard-sidebar-open" : ""}${isChat ? " dashboard-chat-route" : ""}`}>
      <button
        className="dashboard-sidebar-backdrop"
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className="dashboard-sidebar">
        <Link className="dashboard-brand" href="/dashboard">
          <span className="dashboard-brand-mark">P</span>
          <span>PHANTASM</span>
        </Link>

        <nav className="dashboard-navigation" aria-label="Dashboard navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/chat"
                ? pathname.startsWith("/dashboard/chat")
                : item.href === "/dashboard/watch"
                  ? pathname.startsWith("/dashboard/watch")
                  : pathname === "/dashboard";
            return (
              <Link
                className={`dashboard-nav-item${isActive ? " dashboard-nav-item-active" : ""}`}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  setSidebarOpen(false);

                  if (item.href === "/dashboard/watch") {
                    const navigation = window.performance.getEntriesByType("navigation")[0] as
                      | PerformanceNavigationTiming
                      | undefined;
                    if (navigation?.type === "reload") {
                      window.sessionStorage.removeItem("phantasm-last-video");
                      return;
                    }

                    const lastVideoId =
                      window.sessionStorage.getItem("phantasm-last-video");
                    if (lastVideoId) {
                      event.preventDefault();
                      router.push(
                        `/dashboard/watch/${encodeURIComponent(lastVideoId)}`
                      );
                    }
                  }
                }}
              >
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

      <div
        ref={mainRef}
        className={`dashboard-main${isChat ? " dashboard-main-chat" : ""}`}
      >
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        {children}
      </div>
    </div>
  );
}
