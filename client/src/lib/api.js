const BASE = "/api";

let refreshPromise = null;

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Requested-With": "careerguide" },
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function api(path, { method = "GET", body, retry = true } = {}) {
  const isMutating = method !== "GET";
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(isMutating ? { "X-Requested-With": "careerguide" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry && path !== "/auth/refresh" && path !== "/auth/login") {
    const refreshed = await refreshSession();
    if (refreshed.ok) {
      return api(path, { method, body, retry: false });
    }
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const error = new Error(data?.error || "Something went wrong");
    error.status = res.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}
