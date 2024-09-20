export interface IEmailService {
	sendEmail: (to: string, subject: string, text: string, code :number) => Promise<void>;
}
