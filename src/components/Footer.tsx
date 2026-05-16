import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();
  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME ?? "Juniper Ridge Landscape";
  const businessEmail =
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@juniperridgelandscape.com";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 867-5309";
  const serviceRegion =
    process.env.NEXT_PUBLIC_SERVICE_REGION ?? "Wasatch Front, Utah";

  let hasPosts = false;
  try {
    const count = await prisma.post.count({ where: { published: true } });
    hasPosts = count > 0;
  } catch {
    // DB not ready
  }

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    ...(hasPosts ? [{ href: "/blog", label: "Blog" }] : []),
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer aria-label="Site footer" className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo-row">
              <Image
                src="/logo-nav.webp"
                alt="Juniper Ridge Landscape"
                width={165}
                height={40}
                className="footer__logo"
              />
              <span className="footer__wordmark">
                Juniper Ridge
                <br />
                <span className="brand-wordmark__sub">Landscape</span>
              </span>
            </div>
            <p className="footer__description">{t("description")}</p>
          </div>

          <div>
            <h3 className="footer__title">{t("quickLinks")}</h3>
            <nav aria-label="Footer navigation">
              <ul className="footer__list">
                {quickLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="footer__link">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="footer__title">{t("services")}</h3>
            <ul className="footer__list">
              {["Landscape Design", "Hardscape Design", "Planting Plans"].map(
                (s) => (
                  <li key={s} className="footer__link">{s}</li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="footer__title">{t("connect")}</h3>
            <ul className="footer__list">
              <li className="footer__contact-item">
                <svg
                  aria-hidden="true"
                  className="footer__contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${businessEmail}`}
                  className="footer__contact-link"
                >
                  {businessEmail}
                </a>
              </li>
              <li className="footer__contact-item">
                <svg
                  aria-hidden="true"
                  className="footer__contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="footer__contact-link">{phoneNumber}</span>
              </li>
              <li className="footer__contact-item">
                <svg
                  aria-hidden="true"
                  className="footer__contact-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="footer__contact-link">{serviceRegion}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">
            &copy; {year} {siteName}. {t("rights")}
          </p>
          <div className="footer__legal-links">
            <Link href="/privacy" className="footer__link">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="footer__link">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
