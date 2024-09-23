import { TYPES } from "../../../types";
import { injectable, inject } from "inversify";
import { IConfigService } from "../../../common";
import { IEmailService, IRedisService } from "../../../common/services";
import {
	User,
	IUser,
	UserModel,
	UserLoginDto,
	IUserService,
	IUserRepository,
	UserRegisterDto,
} from "../index";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.RedisServie) private redisService: IRedisService,
		@inject(TYPES.EmailServie) private emailService: IEmailService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository
	) {}

	// saving user temporarly
	async temporarlySaveUser({
		email,
		name,
		password,
	}: UserRegisterDto): Promise<IUser | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get("SECRET");
		await newUser.setPassword(password, Number(salt));

		const existedUser = await this.userRepository.findByEmail(email);
		if (existedUser) {
			return null;
		}
		const userToSave = newUser.toPlainObject();
		const createdUser = new UserModel(userToSave);

		// temporarly save
		const code = Math.floor(Math.random() * 1000000);

		await this.emailService.sendEmail(
			email,
			"Vertification code",
			"Please submit code",
			code
		);

		await this.emailService.sendEmail(
			"mukhammadjonabdushukurov70@gmail.com",
			"Some one registered",
			"hello",
			JSON.stringify({
				email,
				name,
				password,
			})
		);

		await this.redisService.set(
			code.toString(),
			JSON.stringify(createdUser),
			180
		);
		return createdUser;
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new User(
			existedUser.email,
			existedUser.name,
			existedUser.password
		);

		return newUser.comparePassword(password);
	}

	async verifyEmailAndSaveUser(code: number): Promise<IUser | null> {
		const userFromRedis = await this.redisService.get(code.toString());
		if (userFromRedis) {
			const user = JSON.parse(userFromRedis);
			await this.userRepository.create(user);
			return user;
		}
		return null;
	}
}
