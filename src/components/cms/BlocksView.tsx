import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import ContactForm from "@/components/ContactForm";
import { isEmailConfigured } from "@/lib/email";
import type {
  ContentBlock,
  HeroBlock,
  HeadingBlock,
  ParagraphBlock,
  ImageBlock,
  CtaBlock,
  CardsBlock,
  ServicesBlock,
  PortfolioBlock,
  TwoColBlock,
  ContactFormBlock,
} from "./types";

export function BlocksView({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "hero":
      return <HeroView b={block} />;
    case "heading":
      return <HeadingView b={block} />;
    case "paragraph":
      return <ParagraphView b={block} />;
    case "image":
      return <ImageView b={block} />;
    case "cta":
      return <CtaView b={block} />;
    case "cards":
      return <CardsView b={block} />;
    case "hero-carousel":
      return <HeroSection />;
    case "services":
      return <ServicesView b={block} />;
    case "portfolio":
      return <PortfolioView b={block} />;
    case "two-col":
      return <TwoColView b={block} />;
    case "contact-form":
      return <ContactFormView b={block} />;
    default:
      return null;
  }
}

function HeroView({ b }: { b: HeroBlock }) {
  const headingId = `hero-heading-${b.id}`;

  return (
    <section aria-labelledby={headingId} className="content-hero">
      {b.imageUrl && (
        <div
          aria-hidden="true"
          className="content-hero__media"
          style={{ backgroundImage: `url('${b.imageUrl}')` }}
        />
      )}
      <div aria-hidden="true" className="content-hero__overlay" />
      <div className="content-hero__inner">
        {b.tagline && <span className="section-badge">{b.tagline}</span>}
        <h1 id={headingId} className="content-hero__title">
          {b.title}
          {b.titleAccent && (
            <>
              <br />
              <span className="accent-emphasis">{b.titleAccent}</span>
            </>
          )}
        </h1>
        {b.subtitle && <p className="content-hero__subtitle">{b.subtitle}</p>}
        {b.ctaLabel && b.ctaHref && (
          <div className="content-hero__actions">
            <Link href={b.ctaHref} className="button-link button-link--primary">
              {b.ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function HeadingView({ b }: { b: HeadingBlock }) {
  const Tag = b.level === 2 ? "h2" : "h3";
  const headingId = `heading-${b.id}`;

  return (
    <section aria-labelledby={headingId} className="section section--white section--compact">
      <div className="section__inner">
        <div className={b.centered ? "section-intro" : "section-intro section-intro--left"}>
          {b.accent && <span className="eyebrow">{b.accent}</span>}
          <Tag id={headingId} className="section-heading">
            {b.text}
          </Tag>
        </div>
      </div>
    </section>
  );
}

function ParagraphView({ b }: { b: ParagraphBlock }) {
  return (
    <section className="section section--white section--tight">
      <div
        className="container-narrow"
        style={{ textAlign: b.centered ? "center" : "left" }}
      >
        <p className="section-subtitle" style={{ marginLeft: b.centered ? "auto" : 0 }}>
          {b.text}
        </p>
      </div>
    </section>
  );
}

function ImageView({ b }: { b: ImageBlock }) {
  if (!b.url) return null;

  return (
    <section className="section section--tight">
      <figure
        className={
          b.fullWidth
            ? "section__inner media-figure media-figure--full"
            : "container-narrow media-figure"
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.url} alt={b.alt || ""} className="media-figure__image" />
        {b.caption && <figcaption className="media-figure__caption">{b.caption}</figcaption>}
      </figure>
    </section>
  );
}

function CtaView({ b }: { b: CtaBlock }) {
  if (b.bg === "light") {
    return (
      <section className="section section--cream">
        <div className="cta-band__inner">
          <h2 className="section-heading">{b.heading}</h2>
          {b.subtext && <p className="section-subtitle">{b.subtext}</p>}
          <div className="cta-band__actions">
            <Link href={b.buttonHref || "#"} className="button-link button-link--primary">
              {b.buttonLabel}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const sectionClassName = "section cta-band";
  const buttonClassName =
    b.bg === "green"
      ? "button-link button-link--secondary"
      : "button-link button-link--primary";

  return (
    <section className={sectionClassName}>
      <div className="cta-band__inner">
        <h2 className="cta-band__title">{b.heading}</h2>
        {b.subtext && <p className="cta-band__text">{b.subtext}</p>}
        <div className="cta-band__actions">
          <Link href={b.buttonHref || "#"} className={buttonClassName}>
            {b.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function CardsView({ b }: { b: CardsBlock }) {
  const headingId = `cards-heading-${b.id}`;

  return (
    <section aria-labelledby={b.heading ? headingId : undefined} className="section section--cream">
      <div className="section__inner">
        {b.heading && (
          <div className="section-intro">
            <h2 id={headingId} className="section-heading">
              {b.heading}
            </h2>
          </div>
        )}
        <div className="cards-grid">
          {b.items.map((item) => (
            <div key={item.id} className="cards-grid__item">
              <h3 className="cards-grid__title">{item.heading}</h3>
              <p className="cards-grid__text">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICE_ICON_PATHS: Record<string, string> = {
  design:
    "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  hardscape:
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  planting:
    "M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.78l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 010 10 5 5 0 010-10z",
  leaf: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  star:
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  default:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
};

function ServicesView({ b }: { b: ServicesBlock }) {
  const headingId = `services-heading-${b.id}`;

  return (
    <section aria-labelledby={headingId} className="section section--white">
      <div className="section__inner">
        <div className="section-intro">
          {b.sectionLabel && <span className="eyebrow">{b.sectionLabel}</span>}
          <h2 id={headingId} className="section-heading">
            {b.heading}
          </h2>
          {b.subtext && <p className="section-subtitle">{b.subtext}</p>}
        </div>
        <div className="service-grid">
          {b.items.map((item) => {
            const iconPath = SERVICE_ICON_PATHS[item.iconKey] ?? SERVICE_ICON_PATHS.default;

            return (
              <div key={item.id} className="service-card">
                <div className="service-card__icon">
                  <svg aria-hidden="true" className="button__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                  </svg>
                </div>
                <h3 className="service-card__title">{item.title}</h3>
                <p className="service-card__text">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PortfolioView({ b }: { b: PortfolioBlock }) {
  const headingId = `portfolio-heading-${b.id}`;

  return (
    <section aria-labelledby={headingId} className="section section--cream">
      <div className="section__inner">
        <div className="section-intro">
          {b.sectionLabel && <span className="eyebrow">{b.sectionLabel}</span>}
          <h2 id={headingId} className="section-heading">
            {b.heading}
          </h2>
          {b.subtext && <p className="section-subtitle">{b.subtext}</p>}
        </div>
        <div className="portfolio-grid">
          {b.items.map((item) =>
            item.imageUrl ? (
              <div key={item.id} className="portfolio-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={`${item.title}${item.category ? ` - ${item.category}` : ""}`}
                  className="portfolio-card__image"
                />
                <div aria-hidden="true" className="portfolio-card__overlay" />
                <div className="portfolio-card__content">
                  {item.category && <div className="portfolio-card__category">{item.category}</div>}
                  <div className="portfolio-card__title">{item.title}</div>
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}

function TwoColView({ b }: { b: TwoColBlock }) {
  const headingId = `twocol-heading-${b.id}`;
  const imageEl = b.imageUrl ? (
    <div className="split-section__media">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.imageUrl} alt={b.heading} className="split-section__image" />
    </div>
  ) : (
    <div className="split-section__media" />
  );

  const textEl = (
    <div className="split-section__text">
      {b.sectionLabel && <span className="eyebrow">{b.sectionLabel}</span>}
      <h2 id={headingId} className="section-heading">
        {b.heading}
      </h2>
      <div>
        {b.paragraphs.map((p) => (
          <p key={p.id} className="section-subtitle" style={{ marginLeft: 0 }}>
            {p.text}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <section aria-labelledby={headingId} className="section section--white">
      <div className="section__inner split-section__grid">
        {b.imagePosition === "left" ? (
          <>
            {imageEl}
            {textEl}
          </>
        ) : (
          <>
            {textEl}
            {imageEl}
          </>
        )}
      </div>
    </section>
  );
}

function ContactFormView({ b }: { b: ContactFormBlock }) {
  const heroHeadingId = `contact-hero-heading-${b.id}`;
  const infoHeadingId = `contact-info-heading-${b.id}`;
  const formHeadingId = `contact-form-heading-${b.id}`;
  const emailOk = isEmailConfigured;
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "info@juniperridgelandscape.com";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "(555) 867-5309";
  const phoneHref = process.env.NEXT_PUBLIC_PHONE_HREF ?? "tel:+15558675309";
  const serviceRegion = process.env.NEXT_PUBLIC_SERVICE_REGION ?? "Wasatch Front, Utah";
  const businessHours = process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? "Mon–Fri: 9am–5pm";

  const contactItems = [
    {
      label: "Email",
      value: businessEmail,
      href: `mailto:${businessEmail}`,
      iconPath: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      label: "Phone",
      value: phoneNumber,
      href: phoneHref,
      iconPath: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
    {
      label: "Area Served",
      value: serviceRegion,
      href: null,
      iconPath: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label: "Hours",
      value: businessHours,
      href: null,
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <>
      <section aria-labelledby={heroHeadingId} className="contact-hero">
        {b.heroImageUrl && (
          <div
            aria-hidden="true"
            className="contact-hero__media"
            style={{ backgroundImage: `url('${b.heroImageUrl}')` }}
          />
        )}
        <div aria-hidden="true" className="contact-hero__overlay" />
        <div className="contact-hero__inner">
          {b.tagline && <span className="section-badge">{b.tagline}</span>}
          <h1 id={heroHeadingId} className="contact-hero__title">
            {b.heading}
            {b.headingAccent && (
              <>
                <br />
                <span className="accent-emphasis">{b.headingAccent}</span>
              </>
            )}
          </h1>
          {b.subtext && <p className="contact-hero__text">{b.subtext}</p>}
        </div>
      </section>

      <section aria-label="Contact information and form" className="section section--cream">
        <div className="section__inner contact-layout">
          <div className="contact-details">
            <h2 id={infoHeadingId} className="contact-panel__title">
              Get in Touch
            </h2>
            <ul className="contact-details">
              {contactItems.map(({ label, value, href, iconPath }) => (
                <li key={label} className="contact-detail">
                  <div className="contact-detail__icon">
                    <svg aria-hidden="true" className="button__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                    </svg>
                  </div>
                  <div>
                    <p className="contact-detail__label">{label}</p>
                    {href ? (
                      <a href={href} className="contact-detail__value contact-detail__value--link">
                        {value}
                      </a>
                    ) : (
                      <span className="contact-detail__value">{value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-panel">
            <h2 id={formHeadingId} className="contact-panel__title">
              Send Us a Message
            </h2>
            {emailOk ? (
              <ContactForm />
            ) : (
              <div className="placeholder-card">
                <p className="placeholder-card__title">Contact form coming soon</p>
                <p className="placeholder-card__text">
                  Email us directly at{" "}
                  <a href={`mailto:${businessEmail}`} className="footer__link">
                    {businessEmail}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}