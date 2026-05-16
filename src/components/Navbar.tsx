"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const staticNavLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

type CmsNavPage = { slug: string; navLabel: string | null; title: string };

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmsPages, setCmsPages] = useState<CmsNavPage[]>([]);
  const [hasPosts, setHasPosts] = useState(false);

  useEffect(() => {
    fetch("/api/pages?nav=true")
      .then((r) => r.ok ? r.json() : { pages: [], hasPosts: false })
      .then((data: { pages: CmsNavPage[]; hasPosts: boolean }) => {
        setCmsPages(data.pages);
        setHasPosts(data.hasPosts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const visibleNavLinks = staticNavLinks.filter(
    (link) => link.key !== "blog" || hasPosts,
  );

  const headerClassName = scrolled
    ? "site-header site-header--scrolled"
    : "site-header";

  return (
    <header className={headerClassName}>
      <div className="site-header__inner">
        <Link href="/" className="brand-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-nav.webp"
              alt="Juniper Ridge Landscape"
              width={165}
              height={80}
              className="brand-logo"
              style={{ aspectRatio: "165/80", width: "auto" }}
              fetchPriority="high"
            />
            <span className="brand-wordmark">
              Juniper Ridge
              <br />
              <span className="brand-wordmark__sub">Landscape</span>
            </span>
          </Link>

          <nav aria-label="Main navigation" className="nav-links">
            {visibleNavLinks.map(({ href, key }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link${active ? " nav-link--active" : ""}`}
                >
                  {t(key)}
                </Link>
              );
            })}
            {cmsPages.map(({ slug, navLabel, title }) => {
              const href = `/${slug}`;
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link${active ? " nav-link--active" : ""}`}
                >
                  {navLabel ?? title}
                </Link>
              );
            })}
          </nav>

          <details
            className="mobile-nav"
            open={isOpen || undefined}
            onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
          >
            <summary
              className="mobile-nav__toggle"
              style={{ touchAction: "manipulation" }}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="mobile-nav__icon mobile-nav__icon--menu"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className="mobile-nav__icon mobile-nav__icon--close"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </summary>
            <div className="mobile-nav__panel">
              <nav aria-label="Mobile navigation" className="mobile-nav__links">
                {visibleNavLinks.map(({ href, key }) => (
                  <Link
                    key={href}
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className={`mobile-nav__link${pathname === href ? " mobile-nav__link--active" : ""}`}
                  >
                    {t(key)}
                  </Link>
                ))}
                {cmsPages.map(({ slug, navLabel, title }) => {
                  const href = `/${slug}`;
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className={`mobile-nav__link${pathname === href ? " mobile-nav__link--active" : ""}`}
                    >
                      {navLabel ?? title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </details>
      </div>
    </header>
  );
}
