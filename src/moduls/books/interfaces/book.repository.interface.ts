import { ISingleBook } from "./book.interface";

export class IBookRepository {
	fetchAllBooks: () => Promise<Array<ISingleBook> | null>;
	fetchSingleBook: (isbn13: string) => Promise<ISingleBook | null>;
	fetchSearchedBook: (query: string) => Promise<Array<ISingleBook> | null>;
}
