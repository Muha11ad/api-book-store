import { Response } from "express";

export const TYPES = {
	Application: Symbol.for("Application"),
	ILogger: Symbol.for("ILogger"),
	UserController: Symbol.for("UserController"),
	ExceptionFilter: Symbol.for("ExceptionFilter"),
	UserService: Symbol.for("UserService"),
	ConfigService: Symbol.for("ConfigService"),
	MongooseService: Symbol.for("MongooseService"),
	UserRepository: Symbol.for("UserRepository"),
};

export type ExpressReturnType = Response<any, Record<string, any>>;
