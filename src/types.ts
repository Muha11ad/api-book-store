import { Response } from "express";

export const TYPES = {
	// log
	ILogger: Symbol.for("ILogger"),

	//app
	Application: Symbol.for("Application"),

	//services
	ConfigService: Symbol.for("ConfigService"),
	MongooseService: Symbol.for("MongooseService"),
	RedisServie: Symbol.for("RedisService"),
	EmailServie: Symbol.for("EmailService"),

	ExceptionFilter: Symbol.for("ExceptionFilter"),

	// book
	BookService: Symbol.for("BookService"),
	BookRepository: Symbol.for("BookRepository"),
	BookController: Symbol.for("BookController"),

	// user
	UserService: Symbol.for("UserService"),
	UserController: Symbol.for("UserController"),
	UserRepository: Symbol.for("UserRepository"),

	// auth
	AuthService: Symbol.for("AuthService"),
	AuthController: Symbol.for("AuthController"),
};

export type ExpressReturnType = Response<any, Record<string, any>>;
