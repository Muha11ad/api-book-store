import { IUser } from "../user.model";
import { UserLoginDto, UserRegisterDto } from "../index";

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<IUser | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
