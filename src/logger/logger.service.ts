import "reflect-metadata";
import { Logger } from "tslog";
import { injectable } from "inversify";

@injectable()
export class LoggerService {
	public logger: Logger<Record<string, unknown>>;

	constructor() {
		this.logger = new Logger<Record<string, unknown>>({
			hideLogPositionForProduction: true,
		});
	}
	log(...args: unknown[]) {
		this.logger.info(...args);
	}
	error(...args: unknown[]) {
		this.logger.error(...args);
	}
	warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
