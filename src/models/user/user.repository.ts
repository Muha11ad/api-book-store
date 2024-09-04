import { injectable } from "inversify";
import { UserModel, IUser } from "./user.shema";
import { IUserRepository } from "./interfaces/user.repository.interface";

@injectable()
export class UserRepository implements IUserRepository {
	async create(user: IUser): Promise<any> {
		const newUser = await UserModel.create(user);
		return newUser.save();
	}

	async findByEmail(email: string): Promise<any | null> {
		return UserModel.findOne({ email }).exec();
	}

	async findById(id: string): Promise<any | null> {
		return UserModel.findById(id).exec();
	}

	async updateById(id: string, user: Partial<IUser>): Promise<IUser | null> {
		return UserModel.findByIdAndUpdate(id, user, { new: true }).exec();
	}

	async deleteById(id: string): Promise<IUser | null> {
		return UserModel.findByIdAndDelete(id).exec();
	}
}
