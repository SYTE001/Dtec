import sanitizeHtml from 'sanitize-html';

export const sanitizeInput = (obj = {}) => {
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = typeof v === 'string' ? sanitizeHtml(v.trim(), { allowedTags: [], allowedAttributes: {} }) : v;
  }
  return clean;
};
