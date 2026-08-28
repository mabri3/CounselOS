"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Today" },
  { href: "/workspace", label: "Workspace" },
  { href: "/matters", label: "Matters" },
  { href: "/decisions", label: "Decisions" },
  { href: "/agents", label: "Agents" },
  { href: "/automations", label: "Automations" },
  { href: "/settings", label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span className="brand-name">Counsel OS</span>
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
        <span className="topbar-spacer" />
        <span className="avatar">BH</span>
      </header>
      {children}
    </div>
  );
}
