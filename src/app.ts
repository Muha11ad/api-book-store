import "reflect-metadata";
import { Server } from "http";
import { TYPES } from "./types";
import { json } from "body-parser";
import express, { Express } from "express";
import { inject, injectable } from "inversify";
import { ILogger } from "./logger/logger.interface";
import { UserController } from "./models/user/user.controller";
import { IMongooseService } from "./db/mongoose.service.interface";
import { IExeptionFilter } from "./error/exeption.filter.interface";
import { AuthMiddleware } from "./common/middlewares/auth.middleware";
import { IConfigService } from "./common/config/config.service.interface";

@injectable()
export class App {
	app: Express;
	port: number;
	server!: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.MongooseService) private mongoService: IMongooseService
	) {
		this.app = express();
		this.port = this.configService.get("PORT") || 9000;
	}

	useMiddleware(): void {
		this.app.use(json());
		// const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
		// this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoute(): void {
		this.app.use("/user", this.userController.router);
	}

	useExeptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		try {
			await this.mongoService.connect();
			this.useMiddleware();
			this.useRoute();
			this.useExeptionFilter();
			this.server = this.app.listen(this.port);
			this.logger.log(`Server is running on port ${this.port}`);
		} catch (error) {
			this.logger.error(`Failed to start the server: ${error}`);
			process.exit(1);
		}
	}
}
