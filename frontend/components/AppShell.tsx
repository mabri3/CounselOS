"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { href: "/", label: "Today" },
  { href: "/briefing", label: "Briefing" },
  { href: "/workspace", label: "Workspace" },
  { href: "/matters", label: "Matters" },
  { href: "/decisions", label: "Decisions" },
  { href: "/skills", label: "Skills" },
  { href: "/automations", label: "Automations" },
];

const adminLinks = [
  { href: "/agents", label: "Agents" },
  { href: "/settings", label: "Settings" },
];

function linkIsActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/briefing") return pathname.startsWith("/briefing") || pathname.startsWith("/watches");
  return pathname.startsWith(href);
}

function NavLinks({ links, pathname }: { links: typeof primaryLinks; pathname: string }) {
  return links.map((link) => {
    const active = linkIsActive(link.href, pathname);
    return (
      <Link aria-current={active ? "page" : undefined} className={`nav-link ${active ? "active" : ""}`} href={link.href} key={link.href}>
        {link.label}
      </Link>
    );
  });
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <img alt="Themis.ai" className="brand-logo" src="/brand/themis-ai-logo-detailed-vibrant-red-v7.png" />
        </Link>
        <nav aria-label="Main navigation" className="nav">
          <span className="nav-group nav-primary"><NavLinks links={primaryLinks} pathname={pathname} /></span>
          <span className="nav-group nav-admin"><NavLinks links={adminLinks} pathname={pathname} /></span>
        </nav>
        <span className="topbar-spacer" />
        <span className="avatar">BH</span>
      </header>
      {children}
    </div>
  );
}
