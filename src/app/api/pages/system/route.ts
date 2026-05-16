import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ─── Default block content for each system page ──────────────────────────────

const HOME_BLOCKS = [
  { id: "home-carousel", type: "hero-carousel" },
  {
    id: "home-services",
    type: "services",
    sectionLabel: "What I Do",
    heading: "Full-Service Landscape Design",
    subtext:
      "From concept to final plans, I handle every detail with care — so your outdoor space comes to life exactly as you envisioned.",
    items: [
      {
        id: "home-svc-1",
        iconKey: "design",
        title: "Landscape & Hardscape Design",
        description:
          "Comprehensive design plans for patios, walkways, retaining walls, and all outdoor living features.",
      },
      {
        id: "home-svc-2",
        iconKey: "planting",
        title: "Planting Plans",
        description:
          "Thoughtfully curated plant palettes suited to Utah's high-mountain climate and your aesthetic vision.",
      },
      {
        id: "home-svc-3",
        iconKey: "hardscape",
        title: "Consultation",
        description:
          "Site assessments and design consultations to get your project started on the right foot.",
      },
    ],
  },
  {
    id: "home-portfolio",
    type: "portfolio",
    sectionLabel: "Our Work",
    heading: "Featured Projects",
    subtext: "A selection of residential landscape and hardscape design projects.",
    items: [
      {
        id: "home-p1",
        title: "Mountain Ridge Retreat",
        category: "Full Landscape Design",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25de3b43e?w=800&q=80",
      },
      {
        id: "home-p2",
        title: "Urban Garden Oasis",
        category: "Garden Design",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
      },
      {
        id: "home-p3",
        title: "Stonecroft Terrace",
        category: "Hardscaping",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      },
      {
        id: "home-p4",
        title: "Native Plant Sanctuary",
        category: "Planting Design",
        imageUrl: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      },
      {
        id: "home-p5",
        title: "Twilight Garden Lighting",
        category: "Outdoor Lighting",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e9a38?w=800&q=80",
      },
      {
        id: "home-p6",
        title: "Riverview Estate",
        category: "Full Landscape Design",
        imageUrl: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
      },
    ],
  },
  {
    id: "home-cta",
    type: "cta",
    heading: "Ready to Transform Your Outdoor Space?",
    subtext:
      "Let's talk about your project. Schedule a free consultation and I'll walk you through the design process — no obligation.",
    buttonLabel: "Schedule a Free Consultation",
    buttonHref: "/contact",
    bg: "green",
  },
];

const ABOUT_BLOCKS = [
  {
    id: "about-hero",
    type: "hero",
    tagline: "About Us",
    title: "Rooted in Passion,",
    titleAccent: "Grown with Purpose",
    subtitle:
      "A sole-practitioner landscape and hardscape design studio serving residential properties throughout the Wasatch Front, Utah.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80",
    ctaLabel: "",
    ctaHref: "",
  },
  {
    id: "about-story",
    type: "two-col",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    imagePosition: "right",
    sectionLabel: "Our Story",
    heading: "Where Every Landscape Tells a Story",
    paragraphs: [
      {
        id: "about-p1",
        text: "Juniper Ridge Landscape was built on a simple belief: every outdoor space has the potential to become something extraordinary. I started this studio to offer homeowners throughout the Wasatch Front a thoughtful, personal approach to landscape and hardscape design.",
      },
      {
        id: "about-p2",
        text: "I spent years studying horticulture and design before establishing Juniper Ridge, bringing a blend of technical knowledge and artistic vision to every project. I believe great landscape design isn't just about aesthetics — it's about creating spaces that enhance how you live and suit the unique character of Utah's environment.",
      },
      {
        id: "about-p3",
        text: "As a one-person studio, I'm involved in every project from the very first site visit through the final set of construction drawings. You'll always work directly with me — no handoffs, no middlemen.",
      },
    ],
  },
  {
    id: "about-values",
    type: "cards",
    heading: "Our Values",
    items: [
      { id: "val-1", heading: "Sustainability", body: "Every design decision considers the long-term health of your landscape and its impact on the local ecosystem." },
      { id: "val-2", heading: "Craftsmanship", body: "Meticulous attention to detail — from site analysis to the final set of drawings — is at the heart of everything I do." },
      { id: "val-3", heading: "Collaboration", body: "I work closely with each client, listening carefully to understand your vision, lifestyle, and priorities." },
      { id: "val-4", heading: "Innovation", body: "I stay current with the latest materials, plants, and design approaches to bring fresh ideas to every project." },
    ],
  },
  {
    id: "about-services",
    type: "services",
    sectionLabel: "Services",
    heading: "What I Offer",
    subtext: "",
    items: [
      {
        id: "about-svc-1",
        iconKey: "design",
        title: "Landscape & Hardscape Design",
        description: "Full design plans for all exterior spaces — patios, pathways, walls, and more.",
      },
      {
        id: "about-svc-2",
        iconKey: "planting",
        title: "Planting Plans",
        description: "Custom plant palettes suited to Utah's climate and your aesthetic preferences.",
      },
    ],
  },
  {
    id: "about-cta",
    type: "cta",
    heading: "Ready to Work Together?",
    subtext:
      "I take on a limited number of projects each season to ensure quality. Let's talk about yours.",
    buttonLabel: "Get In Touch",
    buttonHref: "/contact",
    bg: "green",
  },
];

const CONTACT_BLOCKS = [
  {
    id: "contact-form",
    type: "contact-form",
    tagline: "Contact",
    heading: "Let's Create Something",
    headingAccent: "Beautiful Together",
    subtext:
      "Ready to transform your outdoor space? Reach out and let's start the conversation.",
    heroImageUrl: "https://images.unsplash.com/photo-1460533893735-45cea2212645?w=1920&q=80",
  },
];

const SYSTEM_PAGES = [
  {
    slug: "_home",
    title: "Home Page",
    description: "Juniper Ridge Landscape — beautiful, sustainable outdoor spaces.",
    content: HOME_BLOCKS,
    published: true,
  },
  {
    slug: "_about",
    title: "About Page",
    description:
      "Learn about Juniper Ridge Landscape — a sole-practitioner landscape and hardscape design studio.",
    content: ABOUT_BLOCKS,
    published: true,
  },
  {
    slug: "_contact",
    title: "Contact Page",
    description: "Get in touch with Juniper Ridge Landscape to schedule a design consultation.",
    content: CONTACT_BLOCKS,
    published: true,
  },
];

// GET — admin only. Ensures all 3 system pages exist and returns them.
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results = [];

  for (const sp of SYSTEM_PAGES) {
    const page = await prisma.page.upsert({
      where: { slug: sp.slug },
      update: {},
      create: {
        slug: sp.slug,
        title: sp.title,
        description: sp.description,
        content: JSON.stringify(sp.content),
        published: sp.published,
        showInNav: false,
        navLabel: null,
      },
    });
    results.push(page);
  }

  return NextResponse.json(results);
}
