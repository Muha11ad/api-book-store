import "reflect-metadata";
import { TYPES } from "../../types";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { ILogger } from "../../logger/logger.interface";
import { HTTPError } from "../../error/hrrp-error.class";
import { UserRegisterDto } from "./dto/user-register.dto";
import { Request, NextFunction, Response } from "express";
import { BaseController } from "../../common/base.controller";
import { IUserController } from "./interfaces/user.controller.inteface";
import { IUserService } from "./interfaces/user.service.interface";
import { IConfigService } from "../../common/config/config.service.interface";
import { ValidateMiddleware } from "../../common/middlewares/validate.middleware";

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
		]);
	}
	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);
		console.log(req.body);
		console.log(result);

		if (!result) {
			return next(new HTTPError(401, "ошибка авторизации", "login"));
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
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует"));
		}
		const token = await this.signJWT(
			body.email,
			this.configService.get("SECRET4TOKEN")
		);
		this.ok(res, { email: result.email, id: result, token });
	}

	private async signJWT(email: string, secret: string): Promise<string> {
		const token = sign(
			{
				email,
				isa: Math.floor(Date.now() / 1000),
			},
			secret
		);
		return token as string;
	}
}
