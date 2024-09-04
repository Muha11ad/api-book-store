import "reflect-metadata";
import mongoose from "mongoose";
import { TYPES } from "../types";
import { injectable, inject } from "inversify";
import { IMongooseService } from "./mongoose.service.interface";
import { IConfigService } from "../common/config/config.service.interface";


@injectable()
export class MongooseService implements IMongooseService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService 
	) {}

	public async connect(): Promise<void> {
		try {
			const mongoUri: string = this.configService.get("MONGO_URL");
			await mongoose.connect(mongoUri);
			console.log("MongoDB connected successfully");
		} catch (error) {
			console.error(`MongoDB connection error: ${error}`);
			process.exit(1);
		}
	}
}
