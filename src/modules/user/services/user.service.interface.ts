import { UserLoginDto, UserRegisterDto, IUserDocument, IUser } from "../index";

export interface IUserService {
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	temporarlySaveUser: (dto: UserRegisterDto) => Promise<IUserDocument | null>;
	verifyEmailAndSaveUser: (code: number) => Promise<IUser | null>;
}
