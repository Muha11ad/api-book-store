import { Request, NextFunction, Response } from "express";

export interface IUserController {
	register: (request: Request, response: Response, next: NextFunction) => void;
	login: (request: Request, response: Response, next: NextFunction) => void;
	
}
