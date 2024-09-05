import "reflect-metadata";
import { ILogger } from "../logger";
import { Response, Router } from "express";
import { injectable } from "inversify";
import { IControllerRoute } from "./route.interface";

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}
	get router() {
		return this._router;
	}

	public send<T>(response: Response, code: number, message: T) {
		response.type("application/json");
		return response.status(code).json(message);
	}
	public ok<T>(response: Response, message: T) {
		return this.send<T>(response, 200, message);
	}

	public bindRoutes(routes: IControllerRoute[]) {
		for (const route of routes) {
			this.logger.log(`[${route.method}] : ${route.path}`);
			const middleware = route.middleware?.map((m) => m.execute.bind(m));
			const handle = route.function.bind(this);
			const pipeline = middleware ? [...middleware, handle] : handle;
			this._router[route.method](route.path, pipeline);
		}
	}
}
