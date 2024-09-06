import { Response } from "express";

export const TYPES = {
	ILogger: Symbol.for("ILogger"),
	Application: Symbol.for("Application"),
	BookService: Symbol.for("BookService"),
	UserService: Symbol.for("UserService"),
	ConfigService: Symbol.for("ConfigService"),
	UserRepository: Symbol.for("UserRepository"),
	BookController: Symbol.for("BookController"),
	UserController: Symbol.for("UserController"),
	BookRepository: Symbol.for("BookRepository"),
	MongooseService: Symbol.for("MongooseService"),
	ExceptionFilter: Symbol.for("ExceptionFilter"),
};

export type ExpressReturnType = Response<any, Record<string, any>>;
