import { TYPES } from "../../../types";
import { HTTPError } from "../../../error";
import { ILogger } from "../../../logger";
import { inject, injectable } from "inversify";
import { BaseController } from "../../../common";
import { IBookController, IBookService } from "../index";
import { Request, Response, NextFunction } from "express";
import { AuthMiddleware, IConfigService } from "./../../../common";

@injectable()
export class BookController extends BaseController implements IBookController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.BookService) private bookService: IBookService,
		@inject(TYPES.ConfigService) private configService: IConfigService
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
				path: "/search/:query/:page?",
				method: "get",
				function: this.getSearchedBook,
				middleware: [],
			},
			{
				path: "/order",
				method: "post",
				function: this.orderBook,
				middleware: [
					new AuthMiddleware(this.configService.get("SECRET4TOKEN")),
				],
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
		let { query, page } = req.params;
		const currentPage = page ? parseInt(page) : 1;
		const booksPerPage = 10;

		if (query) {
			const hello = await this.bookService.prepareSearchedBook(
				query,
				currentPage,
				booksPerPage
			);
			if (!hello?.books) {
				return next(new HTTPError(404, "Book not found", "getSearchedBook"));
			}
			this.ok(res, { total: hello?.total, books: hello?.books });
		} else {
			return next(
				new HTTPError(400, "Query parameter is required", "getSearchedBook")
			);
		}
	}
	async orderBook(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const { body, user } = req;
		await this.bookService.prepareOrder(body, user);
		this.ok(res, "Your order has been accepted");
	}
}
