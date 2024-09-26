import "reflect-metadata";
import { sign } from "jsonwebtoken";
import { IAuthService } from "../index";
import { TYPES } from "./../../../types";
import { ILogger } from "./../../../logger";
import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { IAuthController } from "./auth.controller.interface";
import { BaseController, ConfigService } from "../../../common";

@injectable()
export class AuthController extends BaseController implements IAuthController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.AuthService) private authSerive: IAuthService,
		@inject(TYPES.ConfigService) private configService: ConfigService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/google",
				method: "get",
				function: this.redirectToGoogle,
				middleware: [],
			},
			{
				path: "/google/callback",
				method: "get",
				function: this.googleCallBack,
				middleware: [],
			},
			{
				path: "/github",
				method: "get",
				function: this.redirectToGithub,
				middleware: [],
			},
			{
				path: "/github/callback",
				method: "get",
				function: this.githubCallBack,
				middleware: [],
			},
		]);
	}
	// google
	async redirectToGoogle(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		await this.authSerive.googleAuth(req, res);
	}

	async googleCallBack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<string | void> {
		const user = await this.authSerive.googleCallBack(req, res);
		if (user) {
			const token = sign(
				user.email,
				this.configService.get("SECRET4TOKEN") as string
			);
			res.cookie("token", token);

			return res.redirect("http://localhost:3000/IT-Bookstore/");
		}
		this.send(res, 400, "PLease try again later");
	}
	// github
	async redirectToGithub(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		await this.authSerive.githubAuth(req, res);
	}

	async githubCallBack(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<string | void> {
		const user = await this.authSerive.githubCallBack(req, res);
		if (user) {
			const token = sign(
				user.email,
				this.configService.get("SECRET4TOKEN") as string
			);
			res.cookie("token", token);

			return res.redirect("http://localhost:3000/IT-Bookstore/");
		}
		this.send(res, 400, "PLease try again later");
	}
}
