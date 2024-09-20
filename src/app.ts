import "reflect-metadata";
import cors from "cors";
import { Server } from "http";
import { TYPES } from "./types";
import { json } from "body-parser";
import { ILogger } from "./logger";
import { IMongooseService } from "./db";
import { IExeptionFilter } from "./error";
import { IConfigService } from "./common";
import express, { Express } from "express";
import { UserController } from "./modules/user";
import { inject, injectable } from "inversify";
import { BookController } from "./modules/books";

@injectable()
export class App {
	app: Express;
	port: number;
	server!: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.BookController) private bookController: BookController,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.MongooseService) private mongoService: IMongooseService,
		@inject(TYPES.ExceptionFilter) private exeptionFilter: IExeptionFilter
	) {
		this.app = express();
		this.port = this.configService.get("PORT") || 9000;
	}

	useMiddleware(): void {
		this.app.use(
			cors({
				origin: "http://localhost:3000",
				methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
				credentials: true, // Allow credentials (cookies, authorization headers, etc.)
			})
		);
		this.app.use(json());
		// const authMiddleware = new AuthMiddleware(this.configService.get("SECRET"));
		// this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoute(): void {
		this.app.use("/book", this.bookController.router);
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
