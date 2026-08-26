"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Command Center" },
  { href: "/decisions", label: "Decisions" },
  { href: "/automations", label: "Automations" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">§</span>
          <span>Counsel OS</span>
        </Link>
        <nav className="nav">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link className={`nav-link ${active ? "active" : ""}`} href={link.href} key={link.href}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <span className="status-pill">Local MVP · Markdown first</span>
      </header>
      {children}
    </div>
  );
}
