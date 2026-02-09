'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '../../../lib/api';
import { adminFetch } from '../../../lib/admin-api';

const emptyProject = { title: '', description: '', tech_stack: '', github_link: '', demo_link: '' };
const emptySkill = { name: '', level: 50 };

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0 });
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [about, setAbout] = useState({ name: '', title: '', short_bio: '', full_bio: '', profile_photo: '' });
  const [contactInfo, setContactInfo] = useState({ email: '', whatsapp: '', linkedin: '', github: '', location: '' });

  const [projectForm, setProjectForm] = useState(emptyProject);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');

  const fetchAll = async () => {
    const [dashboard, portfolio, skillsData, contactsData] = await Promise.all([
      adminFetch('/admin/dashboard'),
      fetch(`${API_URL}/portfolio`).then((r) => r.json()),
      adminFetch('/admin/skills'),
      adminFetch('/admin/contacts'),
    ]);

    setStats(dashboard);
    setProjects(portfolio.projects || []);
    setSkills(skillsData || []);
    setMessages(contactsData || []);
    if (portfolio.about) setAbout(portfolio.about);
    if (portfolio.contactInfo) setContactInfo(portfolio.contactInfo);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm(emptyProject);
    setSelectedFile(null);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(projectForm).forEach(([k, v]) => payload.append(k, String(v || '')));
    if (selectedFile) payload.append('image', selectedFile);

    if (editingProjectId) {
      await adminFetch(`/admin/projects/${editingProjectId}`, { method: 'PUT', body: payload });
      setStatus('Project updated.');
    } else {
      await adminFetch('/admin/projects', { method: 'POST', body: payload });
      setStatus('Project created.');
    }
    resetProjectForm();
    fetchAll();
  };

  const removeProject = async (id) => {
    await adminFetch(`/admin/projects/${id}`, { method: 'DELETE' });
    setStatus('Project deleted.');
    fetchAll();
  };

  const saveSkill = async (e) => {
    e.preventDefault();
    const payload = JSON.stringify({ ...skillForm, level: Number(skillForm.level) });

    if (editingSkillId) {
      await adminFetch(`/admin/skills/${editingSkillId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      setStatus('Skill updated.');
    } else {
      await adminFetch('/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      setStatus('Skill created.');
    }

    setEditingSkillId(null);
    setSkillForm(emptySkill);
    fetchAll();
  };

  const removeSkill = async (id) => {
    await adminFetch(`/admin/skills/${id}`, { method: 'DELETE' });
    setStatus('Skill deleted.');
    fetchAll();
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    await adminFetch('/admin/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(about),
    });
    setStatus('About content updated.');
  };

  const saveContactInfo = async (e) => {
    e.preventDefault();
    await adminFetch('/admin/contact-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactInfo),
    });
    setStatus('Contact info updated.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-bebas text-5xl leading-none">Admin Dashboard</h1>
        <button className="btn-ghost" onClick={() => { localStorage.removeItem('admin-token'); window.location.href = '/admin/login'; }}>
          Logout
        </button>
      </div>

      {status && <p className="text-sm opacity-80">{status}</p>}

      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="panel">
            <p className="text-xs uppercase tracking-widest opacity-70">{k}</p>
            <p className="mt-2 text-3xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <section className="panel space-y-3">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <form onSubmit={saveProject} className="grid gap-2 md:grid-cols-2">
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" placeholder="Tech stack" value={projectForm.tech_stack} onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })} required />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" placeholder="GitHub URL" value={projectForm.github_link} onChange={(e) => setProjectForm({ ...projectForm, github_link: e.target.value })} />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" placeholder="Demo URL" value={projectForm.demo_link} onChange={(e) => setProjectForm({ ...projectForm, demo_link: e.target.value })} />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
          <textarea className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2 md:col-span-2" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required />
          <div className="md:col-span-2 flex gap-2">
            <button className="btn-solid" type="submit">{editingProjectId ? 'Update Project' : 'Create Project'}</button>
            {editingProjectId && <button className="btn-ghost" type="button" onClick={resetProjectForm}>Cancel</button>}
          </div>
        </form>

        <div className="space-y-2 text-sm">
          {projects.map((p) => (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-secondary/10 dark:border-primary/10 pb-2" key={p.id}>
              <span>{p.title}</span>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => { setEditingProjectId(p.id); setProjectForm({ title: p.title, description: p.description, tech_stack: p.tech_stack, github_link: p.github_link || '', demo_link: p.demo_link || '' }); }}>Edit</button>
                <button className="btn-ghost" onClick={() => removeProject(p.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-3">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <form onSubmit={saveSkill} className="flex flex-wrap gap-2">
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" placeholder="Skill name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" type="number" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} required />
          <button className="btn-solid" type="submit">{editingSkillId ? 'Update Skill' : 'Create Skill'}</button>
          {editingSkillId && <button className="btn-ghost" type="button" onClick={() => { setEditingSkillId(null); setSkillForm(emptySkill); }}>Cancel</button>}
        </form>

        <div className="space-y-2 text-sm">
          {skills.map((s) => (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-secondary/10 dark:border-primary/10 pb-2" key={s.id}>
              <span>{s.name} — {s.level}%</span>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => { setEditingSkillId(s.id); setSkillForm({ name: s.name, level: s.level }); }}>Edit</button>
                <button className="btn-ghost" onClick={() => removeSkill(s.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold mb-3">About Content</h2>
        <form onSubmit={saveAbout} className="grid gap-2">
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" value={about.name || ''} onChange={(e) => setAbout({ ...about, name: e.target.value })} placeholder="Name" />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" value={about.title || ''} onChange={(e) => setAbout({ ...about, title: e.target.value })} placeholder="Title" />
          <textarea className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" value={about.short_bio || ''} onChange={(e) => setAbout({ ...about, short_bio: e.target.value })} placeholder="Short bio" />
          <textarea className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" value={about.full_bio || ''} onChange={(e) => setAbout({ ...about, full_bio: e.target.value })} placeholder="Full bio" rows={5} />
          <input className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2" value={about.profile_photo || ''} onChange={(e) => setAbout({ ...about, profile_photo: e.target.value })} placeholder="Profile photo URL" />
          <button className="btn-solid" type="submit">Save About</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold mb-3">Contact Info</h2>
        <form onSubmit={saveContactInfo} className="grid gap-2 md:grid-cols-2">
          {Object.keys(contactInfo).map((key) => (
            <input
              key={key}
              className="rounded-xl border border-secondary/20 dark:border-primary/20 bg-transparent p-2"
              value={contactInfo[key] || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, [key]: e.target.value })}
              placeholder={key}
            />
          ))}
          <button className="btn-solid md:col-span-2" type="submit">Save Contact Info</button>
        </form>
      </section>

      <section className="panel">
        <h2 className="text-2xl font-semibold mb-3">Recent Messages</h2>
        <div className="space-y-3 text-sm">
          {messages.length ? messages.map((m) => (
            <article key={m.id} className="rounded-xl border border-secondary/10 dark:border-primary/15 p-3">
              <p className="font-medium">{m.name} — {m.email}</p>
              <p className="opacity-80 mt-1">{m.message}</p>
            </article>
          )) : <p className="opacity-70">No messages yet.</p>}
        </div>
      </section>
    </div>
  );
}
