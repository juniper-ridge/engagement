"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
};

const FALLBACK_SLIDE: Slide = {
  id: "fallback",
  title: "",
  subtitle: null,
  imageUrl:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80",
};

const INTERVAL_MS = 6000;

export default function HeroSection() {
  const t = useTranslations("hero");
  const [slides, setSlides] = useState<Slide[]>([FALLBACK_SLIDE]);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((data: Slide[]) => {
        if (Array.isArray(data) && data.length > 0) setSlides(data);
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 400);
    },
    [transitioning],
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [goTo, current, slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length, next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url('${s.imageUrl}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
        <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
          {t("tagline")}
        </span>

        {/* Project label — shown when slides are loaded */}
        {slide.title && (
          <div
            className={`transition-opacity duration-400 ${transitioning ? "opacity-0" : "opacity-100"} mb-4`}
          >
            <p className="text-[#7ec870] font-semibold text-base tracking-wide">
              {slide.title}
            </p>
            {slide.subtitle && (
              <p className="text-white/80 text-sm mt-1">{slide.subtitle}</p>
            )}
          </div>
        )}

        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          {t("title")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="text-[#7ec870]">{line}</span>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
        </h1>

        <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/about"
            className="bg-[#2d5a27] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#4a8a3f] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {t("cta")}
          </Link>
          <Link
            href="/contact"
            className="bg-white/15 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/25 transition-all duration-200"
          >
            {t("contactCta")}
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"}`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next arrows — only when multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Scroll indicator */}
      <button
        onClick={() =>
          document
            .getElementById("services")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label="Scroll to services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-10"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </section>
  );
}
