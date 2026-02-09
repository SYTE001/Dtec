export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow && <p className="text-xs tracking-[0.24em] uppercase opacity-70">{eyebrow}</p>}
      <h2 className="font-bebas text-4xl sm:text-5xl leading-none mt-2">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl opacity-80">{subtitle}</p>}
    </div>
  );
}
