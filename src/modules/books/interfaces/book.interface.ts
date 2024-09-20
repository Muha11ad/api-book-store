export interface ISingleBook {
	error: number;
	title: string;
	subtitle: string;
	authors: string;
	publisher: string;
	isbn10: string;
	isbn13: string;
	pages: string;
	year: string;
	language: string;
	rating: string;
	desc: string;
	price: string;
	image: string;
	url: string;
	pdf: {
		[key: string]: string;
	};
}
