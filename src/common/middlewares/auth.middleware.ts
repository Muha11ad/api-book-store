import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(request: Request, response: Response, next: NextFunction): void {
		try {
			if (request.headers.authorization) {
				verify(
					request.headers.authorization.split(" ")[1],
					this.secret,
					(error, payload) => {
						if (error) {
							response.status(401).json({ message: "Invalid token" });
							return;
						} else if (payload) {
							if (typeof payload !== "string" && payload.email) {
								request.user = payload.email;
								next();
							} else {
								response.status(401).json({ message: "Invalid token payload" });
							}
						}
					}
				);
			} else {
				response.status(401).json({ message: "Authorization header missing" });
			}
		} catch (error) {
			response.status(500).json({ message: "Server error" });
		}
	}
}
