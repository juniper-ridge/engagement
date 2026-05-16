import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const projects = [
  {
    id: 1,
    title: "Mountain Ridge Retreat",
    category: "Full Landscape Design",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25de3b43e?w=800&q=80",
  },
  {
    id: 2,
    title: "Urban Garden Oasis",
    category: "Garden Design",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  },
  {
    id: 3,
    title: "Stonecroft Terrace",
    category: "Hardscaping",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    id: 4,
    title: "Native Plant Sanctuary",
    category: "Planting Design",
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
  },
  {
    id: 5,
    title: "Twilight Garden Lighting",
    category: "Outdoor Lighting",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e9a38?w=800&q=80",
  },
  {
    id: 6,
    title: "Riverview Estate",
    category: "Full Landscape Design",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
];

export default function PortfolioSection() {
  const t = useTranslations("portfolio");

  return (
    <section className="section section--cream">
      <div className="section__inner">
        <div className="section-intro">
          <span className="eyebrow">
            Our Work
          </span>
          <h2 className="section-heading">
            {t("title")}
          </h2>
          <p className="section-subtitle">
            {t("subtitle")}
          </p>
        </div>

        <div className="portfolio-grid">
          {projects.map((project) => (
            <div key={project.id} className="portfolio-card">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="portfolio-card__image"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="portfolio-card__overlay" />
              <div className="portfolio-card__content">
                <span className="portfolio-card__category">
                  {project.category}
                </span>
                <h3 className="portfolio-card__title">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="section-intro">
          <Link href="/contact" className="button-link button-link--ghost">
            {t("viewAll")}
            <svg
              className="button__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
