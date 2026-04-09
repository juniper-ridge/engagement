import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2d5a27]">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold mb-6">
          Ready to Transform Your Outdoor Space?
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Let&apos;s talk about your project. Schedule a free consultation and
          I&apos;ll walk you through the design process — no obligation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-white text-[#2d5a27] px-8 py-4 rounded-full font-bold text-base hover:bg-[#e8f4e6] transition-colors shadow-lg"
          >
            Schedule a Free Consultation
          </Link>
          <Link
            href="/about"
            className="border-2 border-white/60 text-white px-8 py-4 rounded-full font-semibold text-base hover:border-white hover:bg-white/10 transition-colors"
          >
            Learn About Us
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/20 pt-12">
          {[
            { value: "Landscape & Hardscape", label: "Design" },
            { value: "Planting", label: "Plans" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-white mb-1">
                {value}
              </div>
              <div className="text-white/70 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
