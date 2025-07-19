export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
export const PAGE_SIZE = 10

export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
  GUEST: "guest",
}
