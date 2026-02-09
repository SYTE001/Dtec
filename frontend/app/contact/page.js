'use client';

import { useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import { submitContact } from '../../lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    const res = await submitContact(form);
    setStatus(res.message || 'Message sent');
    setPending(false);
  };

  return (
    <section className="space-y-6">
      <SectionTitle eyebrow="Contact" title="Let’s Connect" subtitle="Have an idea, collaboration, or opportunity? Send a message." />
      <div className="panel max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-3" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="w-full rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-3" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <textarea className="w-full rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-3" placeholder="Message" rows={5} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
          <button className="btn-solid" type="submit" disabled={pending}>{pending ? 'Sending...' : 'Send Message'}</button>
        </form>
        {status && <p className="mt-3 text-sm opacity-80">{status}</p>}
      </div>
    </section>
  );
}
