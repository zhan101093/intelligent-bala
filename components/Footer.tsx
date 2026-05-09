const IG_URL =
  "https://www.instagram.com/intelligent_bala?igsh=NW9wank2cXNxbTFj";

export function Footer() {
  return (
    <footer className="bg-text-base text-white/60 py-8 px-4 text-center text-sm leading-relaxed mt-auto">
      <strong className="text-white font-display text-base">Intelligent Bala</strong>
      <br />
      Дамытушы ойыншақтар компаниясы · Алматы қ.
      <br />
      <a
        href="tel:+77711535152"
        className="text-primary-soft hover:text-white transition-colors"
      >
        +7 771 153 51 52
      </a>{" "}
      ·{" "}
      <a
        href={IG_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-soft hover:text-white transition-colors"
      >
        @intelligent_bala
      </a>
    </footer>
  );
}
