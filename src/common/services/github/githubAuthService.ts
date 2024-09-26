import "reflect-metadata";
import passport from "passport";
import { TYPES } from "./../../../types";
import { Response, Request } from "express";
import { IConfigService } from "../../index";
import { inject, injectable } from "inversify";
import { IGithubAuthService } from "./githubAuthService.interface";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import { IUserDocument, IUserRepository } from "./../../../modules/user";

@injectable()
export class GithubAuthService implements IGithubAuthService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository
	) {}
	initialize(): void {
		passport.use(
			new GithubStrategy(
				{
					clientID: this.configService.get("GITHUB_CLIENT_ID"),
					clientSecret: this.configService.get("GITHUB_SECRET_ID"),
					callbackURL: this.configService.get("GITHUB_CALLBACK_URL"),
				},
				async (
					accessToken: string,
					refreshToken: string,
					profile: Profile,
					done: Function
				) => {
					try {
						// Github does not give email , therefore I used profile url instead
						const { profileUrl, username } = profile;

						if (!profileUrl || !username) {
							return done(new Error("Missing email or name"), null);
						}

						let user = await this.userRepository.findByEmail(profileUrl);
						if (!user) {
							user = await this.userRepository.createWithoutPass({
								email: profileUrl,
								name: username,
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
					"github",
					{ failureRedirect: "/login" },
					(err: Error, user: IUserDocument | null) => {
						if (err || !user) {
							return reject(err || "User not found");
						}
						resolve(user);
					}
				)(req, res);
			} catch (error) {
				reject(error || "Something went wrong in github auth serivce");
			}
		});
	}
}
