import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="section cta-band">
      <div className="cta-band__inner">
        <h2 className="cta-band__title">
          Ready to Transform Your Outdoor Space?
        </h2>
        <p className="cta-band__text">
          Let&apos;s talk about your project. Schedule a free consultation and
          I&apos;ll walk you through the design process — no obligation.
        </p>
        <div className="cta-band__actions">
          <Link href="/contact" className="button-link button-link--secondary">
            Schedule a Free Consultation
          </Link>
          <Link href="/about" className="button-link button-link--secondary">
            Learn About Us
          </Link>
        </div>

        <div className="trust-grid">
          {[
            { value: "Landscape & Hardscape", label: "Design" },
            { value: "Planting", label: "Plans" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="trust-grid__value">{value}</div>
              <div className="trust-grid__label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
