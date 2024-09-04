import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {
	@IsEmail({}, { message: "Please enter your email address" })
	email: string;

	@IsString({ message: "Please enter your password" })
	password: string;

	@IsString({ message: "Please enter your name" })
	name: string;
}
