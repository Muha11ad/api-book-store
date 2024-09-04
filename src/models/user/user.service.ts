import { TYPES } from "../../types";
import { User } from "./user.entities";
import { injectable, inject } from "inversify";
import { IUser, UserModel } from "./user.shema";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { IUserService } from "./interfaces/user.service.interface";
import { IConfigService } from "../../common/config/config.service.interface";
import { IUserRepository } from "./interfaces/user.repository.interface";

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<IUser | null> {

		const newUser = new User(email, name);
		const salt = this.configService.get("SECRET");
		await newUser.setPassword(password, Number(salt));


		// Check if the user already exists
		const existedUser = await this.userRepository.findByEmail(email);
		if (existedUser) {
			return null;
		}

		// Convert User instance to a plain object
		const userToSave = newUser.toPlainObject();

		// Use Mongoose model to create a new document
		const createdUser = new UserModel(userToSave);
		return this.userRepository.create(createdUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		// Find the user by email
		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			return false;
		}

		// Create a User instance from the existing data
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		// Compare the provided password with the stored hash
		return newUser.comparePassword(password);
	}
}
