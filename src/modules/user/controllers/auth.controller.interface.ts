import { Request, NextFunction, Response} from "express"

export interface IAuthController {
	redirectToGoogle: (req : Request, res : Response, next : NextFunction) => Promise<void>;
	googleCallBack: (req : Request, res : Response, next : NextFunction) => Promise<string | void>;
}
