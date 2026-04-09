import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME ?? "Juniper Ridge Landscape";
  const businessEmail =
    process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@juniperridgelandscape.com";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 867-5309";
  const serviceRegion =
    process.env.NEXT_PUBLIC_SERVICE_REGION ?? "Wasatch Front, Utah";

  return (
    <footer className="bg-[#1a2316] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#4a8a3f] flex items-center justify-center text-white font-bold text-sm shrink-0">
                JR
              </div>
              <span className="font-[family-name:var(--font-playfair)] font-bold text-white text-lg leading-tight">
                Juniper Ridge
                <br />
                <span className="text-sm font-normal text-gray-400">
                  Landscape
                </span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-[#4a8a3f] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("services")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["Landscape Design", "Hardscape Design", "Planting Plans"].map(
                (s) => (
                  <li key={s}>{s}</li>
                ),
              )}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("connect")}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#4a8a3f] mt-0.5 shrink-0"
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
                  className="hover:text-[#4a8a3f] transition-colors"
                >
                  {businessEmail}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#4a8a3f] mt-0.5 shrink-0"
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
                <span>{phoneNumber}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#4a8a3f] mt-0.5 shrink-0"
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
                <span>{serviceRegion}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {year} {siteName}. {t("rights")}
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
