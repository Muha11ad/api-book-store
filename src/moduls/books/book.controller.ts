import { TYPES } from "../../types";
import { IBookController, IBookService } from "./index";
import { inject, injectable } from "inversify";
import { ILogger } from "../../logger/logger.service.interface";
import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../common/base.controller";
import { HTTPError } from "../../error";

@injectable()
export class BookController extends BaseController implements IBookController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.BookService) private bookService: IBookService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/",
				method: "get",
				function: this.getAllBooks,
				middleware: [],
			},
			{
				path: "/:isbn13",
				method: "get",
				function: this.getSingleBook,
				middleware: [],
			},
			{
				path: "/search/:query",
				method: "get",
				function: this.getSearchedBook,
				middleware: [],
			},
		]);
	}
	async getAllBooks(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const books = await this.bookService.prepareAllBooks();
		if (!books) {
			return next(new HTTPError(400, "Bad request", "getAllbooks"));
		}
		this.ok(res, books);
	}
	async getSingleBook(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		let { isbn13 } = req.params;

		if (isbn13) {
			const book = await this.bookService.prepareSingleBook(isbn13);
			if (!book) {
				return next(new HTTPError(404, "Book not found", "getSinglebooks"));
			}
			this.ok(res, book);
		} else null;
	}
	async getSearchedBook(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		let { query } = req.params;

		if (query) {
			const books = await this.bookService.prepareSearchedBook(query);
			if (!books) {
				return next(new HTTPError(404, "Book not found", "getSearchedBook"));
			}
			this.ok(res, books);
		} else null;
	}
}
