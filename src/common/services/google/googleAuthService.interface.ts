import { IUserDocument } from "./../../../modules/user";
import { Response, Request } from "express";
export interface IGoogleAuthService {
	initialize: () => void;
	handleCallback: (req: Request, res: Response) => Promise<IUserDocument>;
}
