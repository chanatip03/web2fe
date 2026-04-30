import { IDiscordRepository } from "./interface";

export class DiscordService {
  constructor(private readonly discordRepository: IDiscordRepository) {}

  connect() {
    this.discordRepository.connect();
  }
}