import { IOrderBook } from "../model/book.model";
import { ISingleBook } from "../interfaces/book.interface";

export class IBookService {
	prepareAllBooks: () => Promise<Array<ISingleBook> | null>;
	prepareSingleBook: (isbn13: string) => Promise<ISingleBook | null>;
	prepareSearchedBook: (
		query: string,
		page: number,
		booksPerPage: number
	) => Promise<{ total: number; books: Array<ISingleBook> } | null>;
	prepareOrder: (body: IOrderBook, emai: string) => Promise<boolean>;
}
