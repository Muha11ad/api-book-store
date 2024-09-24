import "reflect-metadata";
import { App } from "./app";
import { TYPES } from "./types";
import { LoggerService, ILogger } from "./logger";
import { IConfigService, ConfigService } from "./common";
import { IMongooseService, MongooseService } from "./db";
import { IExeptionFilter, ExeptionFilter } from "./error";
import { Container, ContainerModule, interfaces } from "inversify";
import {
	IRedisService,
	RedisService,
	IEmailService,
	EmailService,
} from "./common/services";
import {
	IBookController,
	BookController,
	IBookRepository,
	BookRepository,
	IBookService,
	BookService,
} from "./modules/books";
import {
	AuthService,
	UserService,
	IUserService,
	IAuthService,
	UserController,
	AuthController,
	UserRepository,
	IUserController,
	IAuthController,
	IUserRepository,
} from "./modules/user";

export interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	try {
		bind<App>(TYPES.Application).to(App);

		bind<IExeptionFilter>(TYPES.ExceptionFilter).to(ExeptionFilter);

		bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();

		//user
		bind<IUserService>(TYPES.UserService).to(UserService);
		bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
		bind<IUserController>(TYPES.UserController)
			.to(UserController)
			.inSingletonScope();

		//auth
		bind<IAuthService>(TYPES.AuthService).to(AuthService);
		bind<IAuthController>(TYPES.AuthController).to(AuthController);

		//book
		bind<IBookService>(TYPES.BookService).to(BookService);
		bind<IBookController>(TYPES.BookController).to(BookController);
		bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);

		//services
		bind<IEmailService>(TYPES.EmailServie).to(EmailService);
		bind<IRedisService>(TYPES.RedisServie).to(RedisService);
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
