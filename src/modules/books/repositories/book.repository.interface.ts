import { ISingleBook } from "../interfaces/book.interface";

export class IBookRepository {
	fetchAllBooks: () => Promise<Array<ISingleBook> | null>;
	fetchSingleBook: (isbn13: string) => Promise<ISingleBook | null>;
	fetchSearchedBook: (
		query: string,
		page: number,
		booksPerPage: number
		
	) => Promise<{ total: number; books: Array<ISingleBook> } | null>;
}
