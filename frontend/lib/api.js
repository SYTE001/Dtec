const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchPortfolio() {
  const res = await fetch(`${API_URL}/portfolio`, { next: { revalidate: 60 } });
  return res.json();
}

export async function submitContact(payload) {
  const res = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export { API_URL };
