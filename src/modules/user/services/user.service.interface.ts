import { UserLoginDto, UserRegisterDto,IUser } from "../index";

export interface IUserService {
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	temporarlySaveUser: (dto: UserRegisterDto) => Promise<IUser | null>;
	verifyEmailAndSaveUser : (code : number) => Promise<IUser | null>;
}
