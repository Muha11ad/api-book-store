import "reflect-metadata";
import { sign } from "jsonwebtoken";
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
				path: "/verifyEmail",
				method: "post",
				function: this.verifyEmailAndSave,
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
		const jwt = await this.signJWT(
			req.body.email,
			this.configService.get("SECRET4TOKEN")
		);
		this.ok(res, { jwt });
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

	private async signJWT(email: string, secret: string): Promise<string> {
		const token = sign({ email }, secret);
		return token as string;
	}

	async verifyEmailAndSave(
		{ body }: Request<{}, {}, { code: number }>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const user = await this.userService.verifyEmailAndSaveUser(body.code);

		if (!user) {
			this.send(res, 422, "Code is invalid");
			return;
		}
		const token = await this.signJWT(
			user.email,
			this.configService.get("SECRET4TOKEN")
		);
		res.cookie("token", token);
		this.ok(res, { user, token });
	}
}
