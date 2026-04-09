import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { isEmailConfigured } from "@/lib/email";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Juniper Ridge Landscape to schedule a design consultation. Serving the Wasatch Front, Utah.",
};

const bookingsUrl = process.env.NEXT_PUBLIC_BOOKINGS_URL || "";
const businessEmail =
  process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@juniperridgelandscape.com";
const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 867-5309";
const phoneHref = process.env.NEXT_PUBLIC_PHONE_HREF ?? "tel:+15558675309";
const serviceRegion =
  process.env.NEXT_PUBLIC_SERVICE_REGION ?? "Wasatch Front region, Utah";
const businessHours =
  process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? "Mon–Fri: 9am–5pm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-[#1a2316] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1460533893735-45cea2212645?w=1920&q=80')",
            }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#2d5a27]/60 border border-[#4a8a3f]/40 text-[#7ec870] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              Contact
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-bold leading-tight mb-6">
              Let's Create Something
              <br />
              <span className="text-[#7ec870]">Beautiful Together</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Ready to transform your outdoor space? Reach out and let's start
              the conversation.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f3]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a2316] mb-6">
                  Get in Touch
                </h2>
                <ul className="space-y-5">
                  {[
                    {
                      label: "Email",
                      value: businessEmail,
                      href: `mailto:${businessEmail}`,
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Phone",
                      value: phoneNumber,
                      href: phoneHref,
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Address",
                      value: serviceRegion,
                      href: null,
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Hours",
                      value: businessHours,
                      href: null,
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ),
                    },
                  ].map(({ label, value, href, icon }) => (
                    <li key={label} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#e8f4e6] text-[#2d5a27] flex items-center justify-center shrink-0">
                        {icon}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#2d5a27] uppercase tracking-wider mb-0.5">
                          {label}
                        </div>
                        {href ? (
                          <a
                            href={href}
                            className="text-[#1a2316] hover:text-[#2d5a27] text-sm transition-colors"
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="text-[#1a2316] text-sm whitespace-pre-line">
                            {value}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1a2316] mb-6">
                Send Us a Message
              </h2>
              {isEmailConfigured ? (
                <ContactForm />
              ) : (
                <div className="rounded-xl border border-[#e8f4e6] bg-[#e8f4e6]/50 p-6 text-center text-[#2d5a27]">
                  <svg
                    className="w-10 h-10 mx-auto mb-3 opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="font-semibold text-[#1a2316] mb-1">
                    Email us directly
                  </p>
                  <a
                    href={`mailto:${businessEmail}`}
                    className="text-[#2d5a27] hover:underline text-sm"
                  >
                    {businessEmail}
                  </a>
                  <p className="text-xs text-gray-500 mt-3">
                    Or give us a call — we'd love to talk about your project.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Microsoft Bookings */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
                Online Scheduling
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#1a2316] mt-3 mb-4">
                Book a Consultation
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Schedule a free 30-minute consultation with our design team
                using our online booking system. Pick a time that works for you.
              </p>
            </div>

            {bookingsUrl ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[650px]">
                <iframe
                  src={bookingsUrl}
                  width="100%"
                  height="100%"
                  scrolling="yes"
                  title="Schedule a consultation with Juniper Ridge Landscape"
                  className="border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-16 text-center text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="font-medium text-gray-500 mb-2">
                  Microsoft Bookings
                </p>
                <p className="text-sm">
                  Set{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    NEXT_PUBLIC_BOOKINGS_URL
                  </code>{" "}
                  in your{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    .env
                  </code>{" "}
                  to your Microsoft Bookings page URL.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
