import { TYPES } from "../../types";
import { IBookController } from "./index";
import { inject, injectable } from "inversify";
import { ILogger } from "../../logger/logger.service.interface";
import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../common/base.controller";

@injectable()
export class BookController extends BaseController implements IBookController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/",
				method: "get",
				function: this.getAllBooks,
				middleware: [],
			},
			{
				path: "/:isbn",
				method: "get",
				function: this.getSingleBook,
				middleware: [],
			},
		]);
	}
	async getAllBooks(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {}
	async getSingleBook(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {}
}
