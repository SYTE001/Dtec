'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <button className="btn-ghost">Theme</button>;

  const isDark = resolvedTheme === 'dark';

  return (
    <button className="btn-ghost" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}
