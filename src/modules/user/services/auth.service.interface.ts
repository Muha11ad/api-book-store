import { IUser } from "../index";
import { Request, Response } from "express";

export interface IAuthService {
    googleAuth: (req: Request, res: Response) => Promise<void>;
	googleCallBack: (req: Request, res: Response) => Promise<Omit<IUser, "password">>;  
    githubAuth: (req: Request, res: Response) => Promise<void>;
	githubCallBack: (req: Request, res: Response) => Promise<Omit<IUser, "password">>;  
}
