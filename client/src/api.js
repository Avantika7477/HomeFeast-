const BASE = import.meta.env.VITE_API_URL || "";

export function getToken() {
  return localStorage.getItem("hf_token");
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error(
      "Cannot reach the API. Start the backend (cd server && npm run dev) and make sure MongoDB is running."
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
