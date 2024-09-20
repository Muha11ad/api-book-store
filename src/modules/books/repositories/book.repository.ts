import { injectable } from "inversify";
import { IBookRepository, ISingleBook, BookModel } from "../index";

@injectable()
export class BookRepository implements IBookRepository {
	async fetchAllBooks(): Promise<Array<ISingleBook> | null> {
		const books = await BookModel.find();

		if (books) {
			return books;
		}

		return null;
	}
	async fetchSingleBook(isbn13: string): Promise<ISingleBook | null> {
		const book = await BookModel.findOne({ isbn13 });
		if (book) {
			return book;
		}

		return null;
	}

	async fetchSearchedBook(
		query: string,
		page: number,
		booksPerPage: number
	): Promise<{ total: number; books: Array<ISingleBook> } | null> {

		const total = await BookModel.countDocuments({
			$or: [
				{ isbn13: query },
				{ desc: { $regex: query, $options: "i" } },
				{ title: { $regex: query, $options: "i" } },
				{ language: { $regex: query, $options: "i" } },
				{ subtitle: { $regex: query, $options: "i" } },
				{ authors: { $regex: query, $options: "i" } },
			],
		});

		const books = await BookModel.find({
			$or: [
				{ isbn13: query },
				{ desc: { $regex: query, $options: "i" } },
				{ title: { $regex: query, $options: "i" } },
				{ language: { $regex: query, $options: "i" } },
				{ subtitle: { $regex: query, $options: "i" } },
				{ authors: { $regex: query, $options: "i" } },
			],
		})
			.skip((page - 1) * booksPerPage)
			.limit(booksPerPage);

		if (books) {
			return {
				total,
				books,
			};
		}
		return null;
	}
}
