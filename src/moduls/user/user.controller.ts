import "reflect-metadata";
import { TYPES } from "../../types";
import { sign } from "jsonwebtoken";
import { HTTPError } from "../../error";
import { ILogger } from "../../logger";
import { inject, injectable } from "inversify";
import { Request, NextFunction, Response } from "express";
import { BaseController, IConfigService,ValidateMiddleware } from "../../common";
import { UserLoginDto, UserRegisterDto, IUserController, IUserService,} from "./index";


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
		const token = sign({ email }, secret);
		return token as string;
	}
}
