"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const navLinks = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#2d5a27] flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:bg-[#4a8a3f] transition-colors">
              JR
            </div>
            <span
              className={`font-[family-name:var(--font-playfair)] font-bold text-lg leading-tight transition-colors ${
                scrolled ? "text-[#2d5a27]" : "text-white drop-shadow"
              }`}
            >
              Juniper Ridge
              <br />
              <span className="text-sm font-medium">Landscape</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(({ href, key }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-all duration-200 px-1 pb-1 border-b-2 ${
                    active && scrolled
                      ? "border-[#2d5a27] text-[#2d5a27] font-semibold"
                      : active
                        ? "border-white text-white font-semibold"
                        : scrolled
                          ? "border-transparent text-gray-700 hover:text-[#2d5a27] hover:border-[#2d5a27]"
                          : "border-transparent text-white/90 hover:text-white hover:border-white"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="ml-2 bg-[#2d5a27] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#4a8a3f] transition-colors"
            >
              {t("getQuote")}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? "text-[#2d5a27]" : "text-white"
            }`}
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#e8f4e6] text-[#2d5a27]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 bg-[#2d5a27] text-white px-4 py-3 rounded-lg text-sm font-semibold text-center hover:bg-[#4a8a3f] transition-colors"
            >
              {t("getQuote")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
