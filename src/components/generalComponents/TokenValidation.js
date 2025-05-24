import { jwtDecode } from "jwt-decode";

export default function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // czas w sekundach
    return decoded.exp > currentTime;
  } catch (e) {
    console.error("Nieprawidłowy token:", e);
    return false;
  }
}
