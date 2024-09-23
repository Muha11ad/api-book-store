export interface IEmailService {
	sendEmail: (
		to: string,
		subject: string,
		text: string,
		code: number | string
	) => Promise<void>;
}
