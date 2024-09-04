import { NextFunction, Request, Response, Router } from "express";
import { IMiddleware } from "./middlewares/middleware.interface";

export interface IControllerRoute {
	path: string;
	function: (request: Request, response: Response, next: NextFunction) => void;
	method: keyof Pick<Router, "get" | "post" | "delete" | "patch" | "put">;
	middleware?: IMiddleware[];
}
