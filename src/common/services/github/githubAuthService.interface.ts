import { IUserDocument } from "./../../../modules/user";
import { Response, Request } from "express";
export interface IGithubAuthService {
	initialize: () => void;
	handleCallback: (req: Request, res: Response) => Promise<IUserDocument>;
}
