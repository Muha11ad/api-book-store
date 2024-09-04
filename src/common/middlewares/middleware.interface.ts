import { NextFunction, Request, Response } from "express";

export interface IMiddleware {
    execute : (requst : Request, response : Response, next : NextFunction) => void;
}