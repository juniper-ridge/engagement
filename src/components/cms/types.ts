export type HeroBlock = {
  id: string;
  type: "hero";
  tagline: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
};

export type HeadingBlock = {
  id: string;
  type: "heading";
  level: 2 | 3;
  text: string;
  accent: string;
  centered: boolean;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  text: string;
  centered: boolean;
};

export type ImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt: string;
  caption: string;
  fullWidth: boolean;
};

export type CtaBlock = {
  id: string;
  type: "cta";
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonHref: string;
  bg: "green" | "dark" | "light";
};

export type CardsBlock = {
  id: string;
  type: "cards";
  heading: string;
  items: Array<{ id: string; heading: string; body: string }>;
};

export type HeroCarouselBlock = {
  id: string;
  type: "hero-carousel";
};

export type ServicesBlock = {
  id: string;
  type: "services";
  sectionLabel: string;
  heading: string;
  subtext: string;
  items: Array<{ id: string; iconKey: string; title: string; description: string }>;
};

export type PortfolioBlock = {
  id: string;
  type: "portfolio";
  sectionLabel: string;
  heading: string;
  subtext: string;
  items: Array<{ id: string; title: string; category: string; imageUrl: string }>;
};

export type TwoColBlock = {
  id: string;
  type: "two-col";
  imageUrl: string;
  imagePosition: "left" | "right";
  sectionLabel: string;
  heading: string;
  paragraphs: Array<{ id: string; text: string }>;
};

export type ContactFormBlock = {
  id: string;
  type: "contact-form";
  tagline: string;
  heading: string;
  headingAccent: string;
  subtext: string;
  heroImageUrl: string;
};

export type ContentBlock =
  | HeroBlock
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | CtaBlock
  | CardsBlock
  | HeroCarouselBlock
  | ServicesBlock
  | PortfolioBlock
  | TwoColBlock
  | ContactFormBlock;
