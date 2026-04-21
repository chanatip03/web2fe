import { IDiscordRepository } from "./interface";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class DiscordRepository implements IDiscordRepository {
  connect(): void {
    window.location.href = `${BASE_URL}/discord/connect`;
  }
}