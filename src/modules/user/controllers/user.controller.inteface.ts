import { Request, NextFunction, Response } from "express";

export interface IUserController {
	login: (request: Request, response: Response, next: NextFunction) => void;	
	register: (request: Request, response: Response, next: NextFunction) => void;
	verifyEmailAndSave: (request: Request, response: Response, next: NextFunction) => void;
	refreshToken : (request: Request, response: Response, next: NextFunction) => void;
}
