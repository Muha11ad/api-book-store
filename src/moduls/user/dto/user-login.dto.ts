import { IsEmail,IsString } from "class-validator";

export class UserLoginDto {
 @IsEmail({}, { message: "Please enter your email address" })
 email: string;
 @IsString({ message: "Please enter your password" })
 password: string;
}