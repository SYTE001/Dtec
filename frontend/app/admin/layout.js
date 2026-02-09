'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isLogin = pathname === '/admin/login';
    const hasToken = !!localStorage.getItem('admin-token');

    if (!isLogin && !hasToken) {
      router.replace('/admin/login');
      return;
    }

    if (isLogin && hasToken) {
      router.replace('/admin/dashboard');
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return <div className="panel">Checking admin access...</div>;
  return children;
}
