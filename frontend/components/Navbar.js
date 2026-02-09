import Link from 'next/link';
import Container from './Container';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-secondary/10 dark:border-primary/10 backdrop-blur bg-primary/70 dark:bg-secondary/70">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-bebas text-3xl leading-none">WANG LIN</Link>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
