import { Schema, model, Document, Model } from "mongoose";

export interface IUser {
	email: string;
	name: string;
	password?: string | null;
}

export interface IUserDocument extends IUser, Document {
	_id: string;
}

const UserSchema: Schema<IUserDocument> = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		default: null,
	},
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>(
	"User",
	UserSchema
);
