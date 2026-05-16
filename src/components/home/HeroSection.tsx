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
    <section className="hero-carousel">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-carousel__slide${i === current ? " hero-carousel__slide--active" : ""}`}
          style={{ backgroundImage: `url('${s.imageUrl}')` }}
        />
      ))}
      <div className="hero-carousel__overlay" />

      <div className="hero-carousel__inner">
        <span className="section-badge">
          {t("tagline")}
        </span>

        {slide.title && (
          <div
            className={`hero-carousel__project${transitioning ? " hero-carousel__project--transitioning" : ""}`}
          >
            <p className="hero-carousel__project-title">{slide.title}</p>
            {slide.subtitle && (
              <p className="hero-carousel__project-subtitle">{slide.subtitle}</p>
            )}
          </div>
        )}

        <h1 className="hero-carousel__title">
          {t("title")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {i === 1 ? (
                  <span className="accent-emphasis">{line}</span>
                ) : (
                  line
                )}
                {i === 0 && <br />}
              </span>
            ))}
        </h1>

        <p className="hero-carousel__subtitle">{t("subtitle")}</p>

        <div className="hero-carousel__actions">
          <Link href="/about" className="button-link button-link--primary">
            {t("cta")}
          </Link>
          <Link href="/contact" className="button-link button-link--secondary">
            {t("contactCta")}
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="hero-carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`hero-carousel__dot${i === current ? " hero-carousel__dot--active" : ""}`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="hero-carousel__arrow hero-carousel__arrow--left"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="hero-carousel__arrow hero-carousel__arrow--right"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      <button
        onClick={() =>
          document
            .getElementById("services")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        aria-label="Scroll to services"
        className="hero-carousel__scroll"
      >
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </section>
  );
}
