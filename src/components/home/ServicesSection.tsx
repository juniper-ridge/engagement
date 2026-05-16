import { useTranslations } from "next-intl";

const serviceIcons: Record<string, React.ReactNode> = {
  design: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
      />
    </svg>
  ),
  hardscape: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  planting: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <section id="services" className="section section--white">
      <div className="section__inner">
        <div className="section-intro">
          <span className="eyebrow">
            What I Do
          </span>
          <h2 className="section-heading">
            {t("title")}
          </h2>
          <p className="section-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <div className="service-grid">
          {serviceKeys.map((key) => (
            <div key={key} className="service-card">
              <div className="service-card__icon">
                {serviceIcons[key]}
              </div>
              <h3 className="service-card__title">
                {t(`${key}.title`)}
              </h3>
              <p className="service-card__text">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
