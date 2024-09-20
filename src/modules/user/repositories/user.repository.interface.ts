import { IUser } from "../user.model";

export interface IUserRepository {
	create(user: IUser): Promise<IUser>;
	findByEmail(email: string): Promise<IUser | null>;
	findById(id: string): Promise<IUser | null>;
	updateById(id: string, user: Partial<IUser>): Promise<IUser | null>;
	deleteById(id: string): Promise<IUser | null>;
}
