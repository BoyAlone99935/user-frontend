// src/api/authApi.js
//
// Cookie-based authentication API.
// The backend is responsible for setting and clearing the HTTP-only auth cookie.

const BASE_URL = "https://fan-platform-backend.onrender.com/api";

async function request(path, options = {}) {
    console.log(`${BASE_URL}${path}`)
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");

  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again.";

    throw new AuthApiError(message, res.status, data);
  }

  return data;
}

export class AuthApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function loginWithPassword({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signupWithPassword({ username, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export function loginWithGoogle({ credential }) {
  return request("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function fetchCurrentUser() {
  return request("/auth/user", {
    method: "GET",
  });
}

export function logoutRequest() {
  return request("/auth/logout", {
    method: "POST",
  });
}