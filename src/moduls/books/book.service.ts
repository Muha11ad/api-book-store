import { TYPES } from "../../types";
import { injectable, inject } from "inversify";
import { ISingleBook} from "./interfaces/book.interface";
import { IBookService } from "./interfaces/book.service.interface";
import { IBookRepository } from "./interfaces/book.repository.interface";

@injectable()
export class BookService implements IBookService {
	constructor(
		@inject(TYPES.BookRepository) private bookRepository: IBookRepository
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
	async prepareSearchedBook(query: string, page: number, booksPerPage: number):Promise<{ total: number; books: Array<ISingleBook> } | null> {
		const hello = await this.bookRepository.fetchSearchedBook(query, page, booksPerPage);
		if (hello?.books) return{ total : hello.total , books : hello?.books};
		return null;
	}
}
