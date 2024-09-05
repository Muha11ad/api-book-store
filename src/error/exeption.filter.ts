import "reflect-metadata"
import { TYPES } from "../types";
import { ILogger } from "../logger";
import { HTTPError } from "./hrrp-error.class";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IExeptionFilter } from "./exeption.filter.interface";

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
	catch(
		err: Error | HTTPError,
		request: Request,
		response: Response,
		next: NextFunction
	) {
		if (err instanceof HTTPError) {
			this.logger.error(
				`[${err.context}] : Ошибка ${err.statusCode} :${err.message} `
			);
			response.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`${err.message}`);
			response.status(500).send({ err: err.message });
		}
	}
}
