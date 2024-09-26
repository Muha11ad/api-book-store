import { ITelegramService } from "./../../../common/services/telegram/telegram.service.interface";
import { TYPES } from "../../../types";
import { injectable, inject } from "inversify";
import { IOrderBook } from "./../model/book.model";
import { IBookService } from "./book.service.interface";
import { ISingleBook } from "../interfaces/book.interface";
import { IBookRepository } from "../repositories/book.repository.interface";

@injectable()
export class BookService implements IBookService {
	constructor(
		@inject(TYPES.BookRepository) private bookRepository: IBookRepository,
		@inject(TYPES.TelegramSerivice) private telegramService: ITelegramService
	) {}
	async prepareAllBooks(): Promise<ISingleBook[] | null> {
		const books = await this.bookRepository.fetchAllBooks();
		if (books) return books;
		return null;
	}
	async prepareSingleBook(isbn13: string): Promise<ISingleBook | null> {
		const book = await this.bookRepository.fetchSingleBook(isbn13);
		if (book) return book;
		return null;
	}
	async prepareSearchedBook(
		query: string,
		page: number,
		booksPerPage: number
	): Promise<{ total: number; books: Array<ISingleBook> } | null> {
		const hello = await this.bookRepository.fetchSearchedBook(
			query,
			page,
			booksPerPage
		);
		if (hello?.books) return { total: hello.total, books: hello?.books };
		return null;
	}
	async prepareOrder(
		{ phone, comment, address, cart }: IOrderBook,
		email: string
	): Promise<boolean> {
		try {
			const data = {
				email,
				phone,
				comment,
				address,
			};
			await this.telegramService.sendOrdersUpdate(data);
			return true;
		} catch (error) {
			return false;
		}
	}
}
