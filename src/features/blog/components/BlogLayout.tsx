import type { ReactNode } from "react";
import { BlogList } from "./BlogList";

export function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row items-stretch">
      <aside className="retro-border shrink-0 h-full">
        <BlogList />
      </aside>
      <section className="retro-border flex-1 min-w-0 h-full">
        {children}
      </section>
    </div>
  );
}
