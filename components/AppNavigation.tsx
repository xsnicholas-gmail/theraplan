"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/#intake", label: "Create plan", icon: "📝" },
  { href: "/account", label: "Account", icon: "👤" },
  { href: "/login", label: "Sign in", icon: "🔐" },
];

export function AppNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  }

  return (
    <>
      <header className="mobile-nav no-print">
        <Link href="/" className="brand-mark" onClick={() => setOpen(false)}><span>TP</span><strong>TheraPlan</strong></Link>
        <button className="hamburger" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span />
          <span />
          <span />
        </button>
      </header>
      <aside className={`sidebar no-print ${open ? "open" : ""}`}>
        <div className="sidebar-inner">
          <Link href="/" className="brand-card" onClick={() => setOpen(false)}>
            <span className="brand-logo">TP</span>
            <div><strong>TheraPlan</strong><small>Adaptive physio planner</small></div>
          </Link>
          <nav className="nav-links" aria-label="Primary navigation">
            {navItems.map((item) => <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : ""} onClick={() => setOpen(false)}><span>{item.icon}</span>{item.label}</Link>)}
          </nav>
          <div className="sidebar-note">
            <p className="eyebrow">Today</p>
            <strong>Log reps, finish sessions, adapt next targets.</strong>
          </div>
        </div>
      </aside>
      {open && <button className="nav-scrim no-print" type="button" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    </>
  );
}
