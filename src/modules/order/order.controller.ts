import { TYPES } from "../../types";
import { ILogger } from "../../logger";
import { IOrderController } from "./index";
import { inject, injectable } from "inversify";
import { BaseController } from "../../common";
import { Request, Response, NextFunction } from "express";
import { IConfigService } from "../../common/config/config.service.interface";

@injectable()
export class OrderController
	extends BaseController
	implements IOrderController
{
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/",
				method: "post",
				function: this.getOrder,
				middleware: [],
			},
		]);
	}

	async getOrder(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {}
}
