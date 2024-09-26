import "reflect-metadata";
import passport from "passport";
import { TYPES } from "./../../../types";
import { Response, Request } from "express";
import { IConfigService } from "../../index";
import { inject, injectable } from "inversify";
import { IGoogleAuthService } from "./googleAuthService.interface";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { IUser, IUserDocument, IUserRepository } from "./../../../modules/user";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}
	initialize(): void {
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
	async handleCallback(req: Request, res: Response): Promise<IUserDocument> {
		return new Promise((resolve, reject) => {
			try {
				passport.authenticate(
					"google",
					{ failureRedirect: "/login" },
					(err: Error, user: IUserDocument | null) => {
						if (err || !user) {
							return reject(err || "User not Found");
						}
						resolve(user);
					}
				)(req, res);
			} catch (error) {
				reject(error || "Something went wrong in google auth service");
			}
		});
	}
}
