import { NextFunction, Request, Response } from "express";

export interface IOrderController {
	getOrder: (request: Request, response: Response, next: NextFunction) => void;

	// cancelOrder : ()
}
