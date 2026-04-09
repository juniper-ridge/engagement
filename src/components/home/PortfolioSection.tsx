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
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f3]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
            Our Work
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#1a2316] mt-3 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[#7ec870] text-xs font-semibold uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="text-white font-[family-name:var(--font-playfair)] font-bold text-xl mt-1">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border-2 border-[#2d5a27] text-[#2d5a27] px-8 py-3.5 rounded-full font-semibold hover:bg-[#2d5a27] hover:text-white transition-all duration-200"
          >
            {t("viewAll")}
            <svg
              className="w-4 h-4"
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
