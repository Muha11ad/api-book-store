import nodemailer from "nodemailer";
import { TYPES } from "../../../types";
import { inject, injectable } from "inversify";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { IEmailService } from "./email.service.interface";
import { IConfigService } from "./../../config/config.service.interface";

@injectable()
export class EmailService implements IEmailService {
	private transporter: nodemailer.Transporter;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		const smtpOptions: SMTPTransport.Options = {
			host: "smtp.gmail.com",
			port: 587,
			secure: false, 
			auth: {
				user: this.configService.get("EMAIL_USER") as string,
				pass: this.configService.get("EMAIL_PASS"),
			},
		};

		this.transporter = nodemailer.createTransport(smtpOptions);
	}

	async sendEmail(
		to: string,
		subject: string,
		text: string,
		code: number
	): Promise<void> {
		await this.transporter.sendMail({
			from: this.configService.get("EMAIL_USER") as string, to,
			subject,
			text,
			html: `<strong>${code}</strong>`, 
		});
	}
}
