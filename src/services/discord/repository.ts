import { IDiscordRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Read a cookie value by name from document.cookie */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export class DiscordRepository implements IDiscordRepository {
  connect(): void {
    // Pass the JWT as ?token= so the backend can auth cross-origin
    // (frontend: onrender.com cookie won't be sent to 72.61.120.249:8000)
    const token = getCookie("access_token");
    const url = token
      ? `${BASE_URL}/discord/connect?token=${encodeURIComponent(token)}`
      : `${BASE_URL}/discord/connect`;
    window.location.href = url;
  }
}