import "reflect-metadata";
import { sign, verify } from "jsonwebtoken";
import { TYPES } from "../../../types";
import { HTTPError } from "../../../error";
import { ILogger } from "../../../logger";
import { inject, injectable } from "inversify";
import { Request, NextFunction, Response } from "express";
import {
	BaseController,
	IConfigService,
	ValidateMiddleware,
} from "../../../common";
import {
	UserLoginDto,
	UserRegisterDto,
	IUserController,
	IUserService,
} from "../index";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/register",
				method: "post",
				function: this.register,
				middleware: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: "/login",
				method: "post",
				function: this.login,
				middleware: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: "/verify",
				method: "post",
				function: this.verifyEmailAndSave,
			},
			{
				path: "/refreshToken",
				method: "get",
				function: this.refreshToken,
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		if (!result) {
			return next(new HTTPError(401, "Cannot find user", "login"));
		}

		const accessToken = await this.signJWT(
			req.body.email,
			this.configService.get("SECRET4TOKEN"),
			"15m"
		);
		const refreshToken = await this.signJWT(
			req.body.email,
			this.configService.get("SECRET4TOKEN"),
			"7d"
		);

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});

		this.ok(res, { message: "Logged in successfully" });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.temporarlySaveUser(body);
		if (!result) {
			this.send(res, 422, "THIS USER ALREADY EXISTS");
			return;
		}
		this.ok(res, "Please verify your email");
	}

	private async signJWT(email: string, secret: string, expiresIn: string): Promise<string> {
		const token = sign({ email }, secret, { expiresIn });
		return token as string;
	}

	async verifyEmailAndSave(
		{ body }: Request<{}, {}, { code: number }>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const user = await this.userService.verifyEmailAndSaveUser(body.code);
		if (!user) {
			this.send(res, 400, "Code is invalid");
			return;
		}

		const accessToken = await this.signJWT(
			user.email,
			this.configService.get("SECRET4TOKEN"),
			"15m"
		);
		const refreshToken = await this.signJWT(
			user.email,
			this.configService.get("SECRET4TOKEN"),
			"7d"
		);

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});

		this.ok(res, { user });
	}

	async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { refreshToken } = req.cookies;
		if (!refreshToken) {
			return next(new HTTPError(403, "Refresh token not provided", "refreshToken"));
		}

		try {
			const decoded = verify(refreshToken, this.configService.get("SECRET4TOKEN") as string) as {email : string, }

			const newAccessToken = await this.signJWT(
				decoded.email,
				this.configService.get("SECRET4TOKEN"),
				"1h"
			);

			res.cookie("accessToken", newAccessToken, {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			this.ok(res, { message: "Access token refreshed" });
		} catch (error) {
			return next(new HTTPError(403, "Invalid refresh token", "refreshToken"));
		}
	}
}
