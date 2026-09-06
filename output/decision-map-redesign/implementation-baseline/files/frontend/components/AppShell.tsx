"use client";

import Link from "next/link";
import { useContinuityIdentity } from "@/lib/continuityApi";
import DemoLawyerSwitcher from "@/components/workspace/DemoLawyerSwitcher";
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
  const { identity, switchPerson } = useContinuityIdentity();
  const isMatter = /^\/matters\/[^/]+/.test(pathname);
  return (
    <div className={`app-shell${isMatter ? " app-shell--matter-a" : ""}`}>
      {isMatter ? <header className="matter-a-brandbar"><details className="matter-a-global-nav"><summary>themis.ai<span aria-hidden="true">⌄</span></summary><nav aria-label="Main navigation"><NavLinks links={[...primaryLinks, ...adminLinks]} pathname={pathname} />{identity?.roster.enabled ? <DemoLawyerSwitcher roster={identity.roster} actor={identity.actor} onSwitch={switchPerson} /> : null}</nav></details></header> : <header className="topbar">
        <Link className="brand" href="/">
          <img alt="Themis.ai" className="brand-logo" src="/brand/themis-ai-logo-detailed-vibrant-red-v7.png" />
        </Link>
        <nav aria-label="Main navigation" className="nav">
          <span className="nav-group nav-primary"><NavLinks links={primaryLinks} pathname={pathname} /></span>
          <span className="nav-group nav-admin"><NavLinks links={adminLinks} pathname={pathname} /></span>
        </nav>
        <span className="topbar-spacer" />
        {identity?.roster.enabled ? <DemoLawyerSwitcher roster={identity.roster} actor={identity.actor} onSwitch={switchPerson} /> : <span className="avatar">{identity?.actor.display_name.slice(0, 2) || ""}</span>}
      </header>}
      {children}
    </div>
  );
}
