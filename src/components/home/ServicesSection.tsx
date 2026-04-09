import { useTranslations } from "next-intl";

const serviceIcons: Record<string, React.ReactNode> = {
  design: (
    <svg
      className="w-7 h-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
  hardscape: (
    <svg
      className="w-7 h-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  planting: (
    <svg
      className="w-7 h-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 010 10 5 5 0 010-10z"
      />
    </svg>
  ),
};

const serviceKeys = ["design", "hardscape", "planting"] as const;

export default function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
            What I Do
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#1a2316] mt-3 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceKeys.map((key) => (
            <div
              key={key}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-[#2d5a27]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-[#e8f4e6] text-[#2d5a27] flex items-center justify-center mb-5 group-hover:bg-[#2d5a27] group-hover:text-white transition-colors duration-300">
                {serviceIcons[key]}
              </div>
              <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1a2316] mb-3">
                {t(`${key}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
