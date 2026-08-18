const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || '요청에 실패했습니다.');
  }
  return data;
}

export async function createEntry(content) {
  const res = await fetch(`${API_BASE}/api/v1/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return handle(res);
}

export async function listEntries() {
  const res = await fetch(`${API_BASE}/api/v1/entries`);
  return handle(res);
}

export async function getEntry(id) {
  const res = await fetch(`${API_BASE}/api/v1/entries/${id}`);
  return handle(res);
}

export async function reanalyzeEntry(id) {
  const res = await fetch(`${API_BASE}/api/v1/entries/${id}/reanalyze`, {
    method: 'POST',
  });
  return handle(res);
}
