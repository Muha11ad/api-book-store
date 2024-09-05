import "reflect-metadata";
import { App } from "./app";
import { TYPES } from "./types";
import { LoggerService, ILogger } from "./logger";
import { IConfigService,ConfigService } from "./common";
import { IMongooseService,MongooseService } from "./db";
import { IExeptionFilter,ExeptionFilter } from "./error";
import { IBookController, BookController } from "./moduls/books";
import { Container, ContainerModule, interfaces } from "inversify";
import { UserRepository, UserService, UserController,  IUserController, IUserService, IUserRepository } from "./moduls/user";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	try {
		bind<App>(TYPES.Application).to(App);
		bind<IUserService>(TYPES.UserService).to(UserService);
		bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
		bind<IUserController>(TYPES.UserController).to(UserController);
		bind<IBookController>(TYPES.BookController).to(BookController);
		bind<IExeptionFilter>(TYPES.ExceptionFilter).to(ExeptionFilter);
		bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
		bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
		bind<IMongooseService>(TYPES.MongooseService).to(MongooseService).inSingletonScope();
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
