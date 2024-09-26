import "reflect-metadata";
import passport from "passport";
import { TYPES } from "../../../types";
import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { IAuthService } from "./auth.service.interface";
import { IUserDocument } from "../index";
import {
	IGoogleAuthService,
	IGithubAuthService,
} from "./../../../common/services";

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.GoogleAuthSerivice)
		private googleAuthService: IGoogleAuthService,
		@inject(TYPES.GithubAuthSerivice)
		private githubAuthService: IGithubAuthService
	) {
		this.googleAuthService.initialize();
		this.githubAuthService.initialize();
	}

	// google
	async googleAuth(req: Request, res: Response): Promise<void> {
		passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
	}

	async googleCallBack(req: Request, res: Response): Promise<IUserDocument> {
		return await this.googleAuthService.handleCallback(req, res);
	}

	// github
	async githubAuth(req: Request, res: Response): Promise<void> {
		passport.authenticate("github", { scope: ["user:email", "profile"] })(req, res);
	}

	async githubCallBack(req: Request, res: Response): Promise<IUserDocument> {
		return await this.githubAuthService.handleCallback(req, res);
	}
}
