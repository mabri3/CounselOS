"use client";

import Link from "next/link";
import { useContinuityIdentity } from "@/lib/continuityApi";
import DemoLawyerSwitcher from "@/components/workspace/DemoLawyerSwitcher";
import { usePathname } from "next/navigation";
import styles from "./Phase2Shell.module.css";
import Phase2Icon from "./Phase2Icon";

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

function NavLinks({ links, pathname, phase2 = false }: { links: typeof primaryLinks; pathname: string; phase2?: boolean }) {
  return links.map((link) => {
    const active = linkIsActive(link.href, pathname);
    return (
      <Link aria-current={active ? "page" : undefined} className={phase2 ? `${styles.link} ${active ? styles.active : ""}` : `nav-link ${active ? "active" : ""}`} href={link.href} key={link.href}>
        {phase2 ? <Phase2Icon name={link.label} /> : null}
        {link.label}
      </Link>
    );
  });
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { identity, switchPerson } = useContinuityIdentity();
  const isResearch = /^\/matters\/[^/]+\/research\/?$/.test(pathname);
  const isMatter = /^\/matters\/[^/]+/.test(pathname) && !isResearch;
  return (
    <div className={`app-shell${isMatter ? " app-shell--matter-a" : ` ${styles.root}`}`}>
      {isMatter ? <header className="matter-a-brandbar"><details className="matter-a-global-nav"><summary>themis.ai<span aria-hidden="true">⌄</span></summary><nav aria-label="Main navigation"><NavLinks links={[...primaryLinks, ...adminLinks]} pathname={pathname} />{identity?.roster.enabled ? <DemoLawyerSwitcher roster={identity.roster} actor={identity.actor} onSwitch={switchPerson} /> : null}</nav></details></header> : <header className={styles.header}>
        <Link className={styles.brand} href="/">themis.ai</Link>
        <nav aria-label="Main navigation" className={styles.nav}>
          <NavLinks links={[...primaryLinks, ...adminLinks]} pathname={pathname} phase2 />
        </nav>
        {identity?.roster.enabled ? <details className={styles.identity}><summary>View as</summary><div><DemoLawyerSwitcher roster={identity.roster} actor={identity.actor} onSwitch={switchPerson} /></div></details> : <span className="avatar">{identity?.actor.display_name.slice(0, 2) || ""}</span>}
      </header>}
      {children}
    </div>
  );
}
