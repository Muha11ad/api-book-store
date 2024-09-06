import { Schema, model, Types } from "mongoose";

const BookSchema = new Schema({
	// required
	title: {
		type: String,
		required: true,
		unique: true,
	},
	subtitle: {
		type: String,
		required: true,
	},
	isbn13: {
		type: String,
		required: true,
		unique: true,
	},
	price: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	language: { type: String, required: true },
	error: { type: Number, required: true },
	authors: { type: String, required: true },
	publisher: { type: String, required: true },
	isbn10: { type: String, required: true },
	pages: { type: String, required: true },
	year: { type: String, required: true },
	rating: { type: String, required: true },
	desc: { type: String, required: true },
	pdf: { type: Object, required: true },
});

export const BookModel = model("Book", BookSchema);
