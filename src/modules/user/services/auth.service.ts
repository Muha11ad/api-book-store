import "reflect-metadata";
import passport from "passport";
import { TYPES } from "../../../types";
import { IUserRepository } from "../index";
import { Response, Request } from "express";
import { inject, injectable } from "inversify";
import { IConfigService } from "../../../common";
import { IAuthService } from "./auth.service.interface";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

@injectable()
export class AuthService implements IAuthService {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {
		this.initializePassport();
	}

	/**
	 * Initialize Passport strategies
	 */
	private initializePassport(): void {
		this.initializeGoogle();
	}

	/**
	 * Initialize Google OAuth strategy
	 */
	private async initializeGoogle() {
		passport.use(
			new GoogleStrategy(
				{
					clientID:
						"627511984164-eom6tllndc5744mt76hijdvr5d90slvs.apps.googleusercontent.com",
					clientSecret: "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",
					callbackURL: "http://localhost:9000/auth/google/callback",
				},
				async (
					accessToken: string,
					refreshToken: string,
					profile: any,
					done: Function
				) => {
					try {
						console.log("profile : " + JSON.stringify(profile));
						const { email, given_name } = profile?._json;
						console.log("profile [ service ] : " + email, given_name);

						// Check if the user already exists in the database
						let user: any = await this.userRepository.findByEmail(email);

						// If user doesn't exist, create a new one
						if (!user) {
							user = await this.userRepository.createWithoutPass({
								email,
								name: given_name,
							});
							console.log("newUser [auth-service] : " + user);
						} else {
							console.log("existing user [auth-service] : " + user);
						}

						// Pass user to done function
						done(null, user);
					} catch (error) {
						console.error("Error in Google Strategy:", error);
						done(error, null);
					}
				}
			)
		);
	}

	/**
	 * Google authentication
	 */
	async googleAuth(req: Request, res: Response): Promise<void> {
		passport.authenticate("google", { scope: ["email", "profile"] })(req, res);
	}

	/**
	 * Google callback handler
	 */
	async googleCallBack(req: Request, res: Response): Promise<any> {
		return new Promise((resolve, reject) => {
			passport.authenticate(
				"google",
				{ failureRedirect: "/login" },
				(err: Error, user: any, info: any) => {
					if (err || !user) {
						console.error("Error during Google Callback:", err);
						return reject(err || "No user found");
					}

					console.log("Authenticated user:", user);
					resolve(user);
				}
			)(req, res);
		});
	}
}
