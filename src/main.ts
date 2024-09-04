import "reflect-metadata";
import { App } from "./app";
import { TYPES } from "./types";
import { ILogger } from "./logger/logger.interface";
import { MongooseService } from "./db/mongo.service";
import { LoggerService } from "./logger/logger.service";
import { UserService } from "./models/user/user.service";
import { ExeptionFilter } from "./error/exeption.filter";
import { UserController } from "./models/user/user.controller";
import { ConfigService } from "./common/config/config.service";
import { IMongooseService } from "./db/mongoose.service.interface";
import { Container, ContainerModule, interfaces } from "inversify";
import { IExeptionFilter } from "./error/exeption.filter.interface";
import { IConfigService } from "./common/config/config.service.interface";
import { IUserService } from "./models/user/interfaces/user.service.interface";
import { IUserController } from "./models/user/interfaces/user.controller.inteface"
import { IUserRepository } from "./models/user/interfaces/user.repository.interface";
import { UserRepository } from "./models/user/user.repository";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	try {
		bind<App>(TYPES.Application).to(App);
		bind<IUserService>(TYPES.UserService).to(UserService);
		bind<IUserController>(TYPES.UserController).to(UserController);
		bind<IExeptionFilter>(TYPES.ExceptionFilter).to(ExeptionFilter);
		bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
		bind<IUserRepository>(TYPES.UserRepository).to(UserRepository)
		bind<IConfigService>(TYPES.ConfigService)
			.to(ConfigService)
			.inSingletonScope();
		bind<IMongooseService>(TYPES.MongooseService)
			.to(MongooseService)
			.inSingletonScope();
	} catch (error) {
		console.log(`error in appBindings :  ${error}`);
	}
});

async function bootstrap(): Promise<IBootstrapReturn | undefined> {
	try {
		const appContainer = new Container();
		appContainer.load(appBindings);
		const app = appContainer.get<App>(TYPES.Application);
		await app.init();
		return { appContainer, app };
	} catch (error) {
		console.log(`error in bootstrap function :  ${error}`);
		return undefined;
	}
}

export const bootstrapResult = bootstrap();
