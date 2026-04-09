import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Juniper Ridge Landscape — a sole-practitioner landscape and hardscape design studio serving the Wasatch Front, Utah.",
};

// --- Icon map (iconKey → SVG path) ----------------------------------------

const ICON_PATHS: Record<string, string> = {
  sustainability:
    "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  craftsmanship:
    "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  collaboration:
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  innovation:
    "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  leaf: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

// --- Fallback data shown when the DB has no records yet ------------------

const DEFAULT_SETTINGS = {
  heroTagline: "About Us",
  heroTitle1: "Rooted in Passion,",
  heroTitle2: "Grown with Purpose",
  heroSubtitle:
    "A sole-practitioner landscape and hardscape design studio serving residential properties throughout the Wasatch Front, Utah.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80",
  storyImageUrl:
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
  storyHeading: "Where Every Landscape Tells a Story",
  storyParagraph1:
    "Juniper Ridge Landscape was built on a simple belief: every outdoor space has the potential to become something extraordinary. I started this studio to offer homeowners throughout the Wasatch Front a thoughtful, personal approach to landscape and hardscape design.",
  storyParagraph2:
    "I spent years studying horticulture and design before establishing Juniper Ridge, bringing a blend of technical knowledge and artistic vision to every project. I believe great landscape design isn't just about aesthetics — it's about creating spaces that enhance how you live and suit the unique character of Utah's environment.",
  storyParagraph3:
    "As a one-person studio, I'm involved in every project from the very first site visit through the final set of construction drawings. You'll always work directly with me — no handoffs, no middlemen.",
  teamSectionLabel: "The Designer",
  teamSectionTitle: "Meet the Designer",
  teamSectionSubtitle:
    "A solo practice — you work directly with me on every project.",
};

const DEFAULT_SERVICES = ["Landscape & Hardscape Design", "Planting Plans"];

const DEFAULT_VALUES = [
  {
    id: "d1",
    iconKey: "sustainability",
    title: "Sustainability",
    description:
      "We design with nature in mind, using native plants, water-wise practices, and eco-friendly materials that support local ecosystems.",
  },
  {
    id: "d2",
    iconKey: "craftsmanship",
    title: "Craftsmanship",
    description:
      "Every detail matters. We take pride in precision, quality materials, and meticulous execution that stands the test of time.",
  },
  {
    id: "d3",
    iconKey: "collaboration",
    title: "Collaboration",
    description:
      "Your vision drives our design. We listen deeply and work with you every step of the way to ensure the result exceeds expectations.",
  },
  {
    id: "d4",
    iconKey: "innovation",
    title: "Innovation",
    description:
      "We stay ahead of design trends and horticultural science to bring fresh, creative ideas to every outdoor space we touch.",
  },
];

const DEFAULT_TEAM = [
  {
    id: "d1",
    name: "Sarah Mitchell",
    role: "Owner & Designer",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "With a degree in Landscape Architecture and a background in Utah horticulture, Sarah brings deep knowledge of Wasatch Front conditions — soil, climate, water use, and native plants — to every design. You'll work directly with her from your first consultation to your finished drawings.",
  },
];

// =========================================================================

export default async function AboutPage() {
  const [dbSettings, dbServices, dbValues, dbTeam] = await Promise.all([
    prisma.aboutPageSettings.findFirst(),
    prisma.aboutService.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.aboutValue.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
    prisma.aboutTeamMember.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const s = { ...DEFAULT_SETTINGS, ...(dbSettings ?? {}) };
  const services =
    dbServices.length > 0
      ? dbServices.map((svc) => svc.name)
      : DEFAULT_SERVICES;
  const values = dbValues.length > 0 ? dbValues : DEFAULT_VALUES;
  const team = dbTeam.length > 0 ? dbTeam : DEFAULT_TEAM;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#1a2316]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url('${s.heroImageUrl}')` }}
          />
          <div className="relative max-w-4xl mx-auto text-center text-white">
            <span className="inline-block bg-[#2d5a27]/60 border border-[#4a8a3f]/40 text-[#7ec870] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
              {s.heroTagline}
            </span>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl font-bold leading-tight mb-6">
              {s.heroTitle1}
              <br />
              <span className="text-[#7ec870]">{s.heroTitle2}</span>
            </h1>
            <p className="text-white/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              {s.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="bg-[#2d5a27] py-14 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-center text-white">
            {services.map((service) => (
              <div
                key={service}
                className="font-[family-name:var(--font-playfair)] text-2xl font-bold px-8 py-4 border border-white/20 rounded-full"
              >
                {service}
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={s.storyImageUrl}
                alt="Juniper Ridge Landscape design work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg px-5 py-4">
                <div className="font-[family-name:var(--font-playfair)] font-bold text-2xl text-[#2d5a27]">
                  Wasatch
                </div>
                <div className="text-gray-600 text-sm">Front, Utah</div>
              </div>
            </div>
            <div>
              <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
                My Story
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#1a2316] mt-3 mb-6">
                Where Every Landscape Tells a Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Juniper Ridge Landscape was built on a simple belief: every
                  outdoor space has the potential to become something
                  extraordinary. I started this studio to offer homeowners
                  throughout the Wasatch Front a thoughtful, personal approach
                  to landscape and hardscape design.
                </p>
                <p>
                  I spent years studying horticulture and design before
                  establishing Juniper Ridge, bringing a blend of technical
                  knowledge and artistic vision to every project. I believe
                  great landscape design isn’t just about aesthetics — it’s
                  about creating spaces that enhance how you live and suit the
                  unique character of Utah’s environment.
                </p>
                <p>
                  As a one-person studio, I’m involved in every project from the
                  very first site visit through the final set of construction
                  drawings. You’ll always work directly with me — no handoffs,
                  no middlemen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
                What I Stand For
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#1a2316] mt-3">
                My Values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {values.map((v) => (
                <div
                  key={v.id}
                  className="flex gap-5 p-8 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#e8f4e6] text-[#2d5a27] flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={ICON_PATHS[v.iconKey] ?? ICON_PATHS.sustainability}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] font-bold text-lg text-[#1a2316] mb-2">
                      {v.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {v.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#2d5a27] font-semibold text-sm uppercase tracking-widest">
                {s.teamSectionLabel}
              </span>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#1a2316] mt-3 mb-4">
                {s.teamSectionTitle}
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                {s.teamSectionSubtitle}
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-12">
              {team.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-5 ring-4 ring-[#e8f4e6] group-hover:ring-[#2d5a27] transition-all duration-300">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                  <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#1a2316] mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#2d5a27] font-semibold text-sm mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
