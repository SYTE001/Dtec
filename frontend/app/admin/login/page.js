'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../lib/api';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: 'wanglin@gmail.com', password: '' });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('admin-token', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="mx-auto max-w-md panel">
      <h1 className="font-bebas text-5xl leading-none">Admin Login</h1>
      <p className="mt-2 text-sm opacity-70">Secure access for content management.</p>

      <form onSubmit={submit} className="mt-6 space-y-3">
        <input
          className="w-full rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-3"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          className="w-full rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-3"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          required
        />
        <button className="btn-solid" disabled={pending} type="submit">
          {pending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </section>
  );
}
