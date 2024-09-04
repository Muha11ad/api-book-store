import { User } from "../user.entities";
import { UserLoginDto } from "../dto/user-login.dto";
import { UserRegisterDto } from "../dto/user-register.dto";

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<any | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
