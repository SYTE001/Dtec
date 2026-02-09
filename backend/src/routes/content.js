import express from 'express';
import multer from 'multer';
import path from 'path';
import { z } from 'zod';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { sanitizeInput } from '../middleware/validators.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'src/uploads',
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});
const upload = multer({ storage });

const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  tech_stack: z.string().min(2),
  github_link: z.string().url().optional().or(z.literal('')),
  demo_link: z.string().url().optional().or(z.literal('')),
});

const skillSchema = z.object({
  name: z.string().min(2),
  level: z.coerce.number().min(0).max(100),
});

router.get('/portfolio', async (_req, res) => {
  const [about, skills, projects, contacts] = await Promise.all([
    query('SELECT * FROM about LIMIT 1'),
    query('SELECT * FROM skills ORDER BY level DESC'),
    query('SELECT * FROM projects ORDER BY created_at DESC'),
    query('SELECT email, whatsapp, linkedin, github, location FROM contact_info LIMIT 1'),
  ]);

  return res.json({
    about: about.rows[0] || null,
    skills: skills.rows,
    projects: projects.rows,
    contactInfo: contacts.rows[0] || null,
  });
});

router.post('/contacts', async (req, res) => {
  const payload = sanitizeInput(req.body);
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(5) });
  try {
    const data = schema.parse(payload);
    await query('INSERT INTO contacts(name, email, message) VALUES($1,$2,$3)', [data.name, data.email, data.message]);
    return res.status(201).json({ message: 'Message sent' });
  } catch {
    return res.status(400).json({ message: 'Invalid contact form payload' });
  }
});

router.use('/admin', authenticateToken);

router.get('/admin/dashboard', async (_req, res) => {
  const [projects, skills, messages] = await Promise.all([
    query('SELECT COUNT(*)::int AS total FROM projects'),
    query('SELECT COUNT(*)::int AS total FROM skills'),
    query('SELECT COUNT(*)::int AS total FROM contacts'),
  ]);
  return res.json({
    projects: projects.rows[0].total,
    skills: skills.rows[0].total,
    messages: messages.rows[0].total,
  });
});

router.post('/admin/projects', upload.single('image'), async (req, res) => {
  try {
    const parsed = projectSchema.parse(sanitizeInput(req.body));
    const image = req.file ? `/uploads/${path.basename(req.file.path)}` : null;
    const result = await query(
      'INSERT INTO projects(title, description, tech_stack, github_link, demo_link, image) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [parsed.title, parsed.description, parsed.tech_stack, parsed.github_link || null, parsed.demo_link || null, image],
    );
    return res.status(201).json(result.rows[0]);
  } catch (e) {
    return res.status(400).json({ message: e?.errors?.[0]?.message || 'Invalid project payload' });
  }
});

router.put('/admin/projects/:id', upload.single('image'), async (req, res) => {
  try {
    const parsed = projectSchema.parse(sanitizeInput(req.body));
    const image = req.file ? `/uploads/${path.basename(req.file.path)}` : req.body.image || null;
    const result = await query(
      'UPDATE projects SET title=$1, description=$2, tech_stack=$3, github_link=$4, demo_link=$5, image=$6 WHERE id=$7 RETURNING *',
      [parsed.title, parsed.description, parsed.tech_stack, parsed.github_link || null, parsed.demo_link || null, image, req.params.id],
    );
    return res.json(result.rows[0]);
  } catch (e) {
    return res.status(400).json({ message: e?.errors?.[0]?.message || 'Invalid project payload' });
  }
});

router.delete('/admin/projects/:id', async (req, res) => {
  await query('DELETE FROM projects WHERE id=$1', [req.params.id]);
  return res.status(204).send();
});

router.get('/admin/skills', async (_req, res) => res.json((await query('SELECT * FROM skills ORDER BY level DESC')).rows));
router.post('/admin/skills', async (req, res) => {
  try {
    const parsed = skillSchema.parse(sanitizeInput(req.body));
    const result = await query('INSERT INTO skills(name, level) VALUES($1,$2) RETURNING *', [parsed.name, parsed.level]);
    return res.status(201).json(result.rows[0]);
  } catch {
    return res.status(400).json({ message: 'Invalid skill payload' });
  }
});
router.put('/admin/skills/:id', async (req, res) => {
  try {
    const parsed = skillSchema.parse(sanitizeInput(req.body));
    const result = await query('UPDATE skills SET name=$1, level=$2 WHERE id=$3 RETURNING *', [parsed.name, parsed.level, req.params.id]);
    return res.json(result.rows[0]);
  } catch {
    return res.status(400).json({ message: 'Invalid skill payload' });
  }
});
router.delete('/admin/skills/:id', async (req, res) => {
  await query('DELETE FROM skills WHERE id=$1', [req.params.id]);
  return res.status(204).send();
});


router.get('/admin/contacts', async (_req, res) => {
  const result = await query('SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC LIMIT 100');
  return res.json(result.rows);
});

router.put('/admin/about', async (req, res) => {
  const data = sanitizeInput(req.body);
  await query(
    'UPDATE about SET name=$1, title=$2, short_bio=$3, full_bio=$4, profile_photo=$5 WHERE id=(SELECT id FROM about LIMIT 1)',
    [data.name, data.title, data.short_bio, data.full_bio, data.profile_photo],
  );
  return res.json({ message: 'Updated' });
});

router.put('/admin/contact-info', async (req, res) => {
  const data = sanitizeInput(req.body);
  await query(
    'UPDATE contact_info SET email=$1, whatsapp=$2, linkedin=$3, github=$4, location=$5 WHERE id=(SELECT id FROM contact_info LIMIT 1)',
    [data.email, data.whatsapp, data.linkedin, data.github, data.location],
  );
  return res.json({ message: 'Updated' });
});

export default router;
