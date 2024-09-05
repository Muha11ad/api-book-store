export interface ISingleBook {
	error: number;
	title: string;
	subtitle: string;
	authors: string;
	publisher: string;
	isbn10: number;
	isbn13: number;
	pages: number;
	year: number;
	rating: number;
	desc: number;
	price: string;
	image: string;
	url: string;
	pdf: {
		[key: string]: string;
	};
}

export interface IBooks {
	title: string;
	subtitle: string;
	isbn13: number;
	price: string;
	image: string;
	url: string;
}
