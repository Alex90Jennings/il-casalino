interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export function SectionHeading({ title, subtitle, light = false }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`font-serif text-3xl md:text-4xl font-light tracking-wide mb-3 ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-sm tracking-[0.08em] ${
            light ? "text-white/60" : "text-stone"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mx-auto mt-4 w-10 h-px ${
          light ? "bg-white/30" : "bg-stone-light"
        }`}
      />
    </div>
  );
}
