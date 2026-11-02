import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { DashboardQueryProvider } from "@/components/dashboard-query-provider";
import { PersistentVideoPlayer } from "@/components/persistent-video-player";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardQueryProvider>
      <DashboardShell>{children}</DashboardShell>
      <PersistentVideoPlayer />
    </DashboardQueryProvider>
  );
}
