import { TYPES } from "../../types";
import { User } from "./user.entities";
import { injectable, inject } from "inversify";
import { IUser, UserModel } from "./user.model";
import { IConfigService } from "../../common";
import { IUserService,IUserRepository,UserRegisterDto,UserLoginDto } from "./index";

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


		const existedUser = await this.userRepository.findByEmail(email);
		if (existedUser) {
			return null;
		}

		const userToSave = newUser.toPlainObject();

		const createdUser = new UserModel(userToSave);
		return this.userRepository.create(createdUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {

		const existedUser = await this.userRepository.findByEmail(email);
		if (!existedUser) {
			return false;
		}

		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

		return newUser.comparePassword(password);
	}
}
