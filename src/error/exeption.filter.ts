import { ILogger } from "../logger/logger.interface";
import { Request, Response, NextFunction } from "express";
import { HTTPError } from "./hrrp-error.class";
import { IExeptionFilter } from "./exeption.filter.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import "reflect-metadata"

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
