import { IUser } from "../user.model";
import { UserLoginDto, UserRegisterDto } from "../index";

export interface IUserService {
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	temporarlySaveUser: (dto: UserRegisterDto) => Promise<IUser | null>;
	verifyEmailAndSaveUser : (code : number) => Promise<IUser | null>;
}
