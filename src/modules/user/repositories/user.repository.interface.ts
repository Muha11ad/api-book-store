import { IUser } from "../index";

export interface IUserRepository {
	create: (user: IUser) => Promise<IUser>;
	findById: (id: string) => Promise<IUser | null>;
	deleteById: (id: string) => Promise<IUser | null>;
	findByEmail: (email: string) => Promise<IUser | null>;
	createWithoutPass: (user: IUser) => Promise<IUser>;
	updateById: (id: string, user: Partial<IUser>) => Promise<IUser | null>;
}
