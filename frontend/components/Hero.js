import Link from 'next/link';

export default function Hero({ about }) {
  return (
    <section className="grid gap-8 lg:grid-cols-2 lg:items-center py-10 sm:py-16">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] opacity-70">Personal Portfolio</p>
        <h1 className="font-bebas mt-2 text-6xl sm:text-7xl lg:text-8xl leading-none">{about?.name || 'WANG LIN'}</h1>
        <p className="mt-1 text-xl sm:text-2xl opacity-90">{about?.title || 'Ascendant GOD'}</p>
        <p className="mt-5 max-w-xl opacity-80">{about?.short_bio}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="btn-solid">Contact</Link>
          <Link href="/portfolio" className="btn-ghost">View Projects</Link>
        </div>
      </div>

      <div className="panel min-h-[280px] sm:min-h-[360px] grid place-items-center text-center">
        <p className="max-w-sm opacity-80">Modern. Clean. Premium. Mobile-first portfolio experience with secure admin-driven content.</p>
      </div>
    </section>
  );
}
