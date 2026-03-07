const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function buildApiUrl(path) {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getSessionSnapshot() {
  const response = await fetch(buildApiUrl("/api/session"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Session bootstrap failed with ${response.status}.`);
  }

  return response.json();
}
