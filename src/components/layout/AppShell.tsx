import { SidebarNav } from "./SidebarNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col mx-auto">
      <div className="flex flex-row items-start flex-1 overflow-hidden">
        <SidebarNav />
        <main className="flex-1 min-w-0 flex flex-col items-start overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
