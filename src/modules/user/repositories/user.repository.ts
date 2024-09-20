import { injectable } from "inversify";
import { IUserRepository, UserModel, IUser } from "../index";

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
