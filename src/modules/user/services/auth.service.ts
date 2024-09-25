import { IUser } from "..";
import "reflect-metadata";
import passport from "passport";
import { TYPES } from "../../../types";
import { IUserRepository, IUserDocument } from "../index";
import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { IConfigService } from "../../../common";
import { IAuthService } from "./auth.service.interface";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.initializePassport();
	}
	private initializePassport(): void {
		this.initializeGoogle();
	}

	private async initializeGoogle() {
		passport.use(
			new GoogleStrategy(
				{
					clientID: this.configService.get("GOOGLE_CLIENT_ID"),
					clientSecret: this.configService.get("GOOGLE_SECRET_ID"),
					callbackURL: this.configService.get("GOOGLE_CALLBACK_URL") as string,
				},
				async (
					accessToken: string,
					refreshToken: string,
					profile: Profile,
					done: Function
				) => {
					try {
						const { email, given_name } = profile._json;

						if (!email || !given_name) {
							return null;
						}
						let user: IUser | null = await this.userRepository.findByEmail(
							email
						);

						if (!user) {
							user = await this.userRepository.createWithoutPass({
								email,
								name: given_name,
							});
						}

						done(null, user);
					} catch (error) {
						done(error, null);
					}
				}
			)
		);
	}

	async googleAuth(req: Request, res: Response): Promise<void> {
		passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
	}

	async googleCallBack(req: Request, res: Response): Promise<IUserDocument> {
		return new Promise((resolve, reject) => {
			passport.authenticate(
				"google",
				{ failureRedirect: "/login" },
				(err: Error, user: IUserDocument | null, info: Record<string, any>) => {
					if (err || !user) {
						return reject(err || "No user found");
					}
					resolve(user);
				}
			)(req, res);
		});
	}
}
