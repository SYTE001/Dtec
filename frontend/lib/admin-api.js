'use client';

import { API_URL } from './api';

const token = () => (typeof window !== 'undefined' ? localStorage.getItem('admin-token') : null);

export async function adminFetch(path, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token() || ''}`,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 || res.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-token');
      window.location.href = '/admin/login';
    }
    throw new Error('Unauthorized');
  }

  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
