import { NextFunction, Request, Response } from "express";

export interface IBookController {
    orderBook : (request: Request, response: Response, next: NextFunction) => void;
    getAllBooks : (request: Request, response: Response, next: NextFunction) => void;
    getSingleBook : (request: Request, response: Response, next: NextFunction) => void;
    getSearchedBook : (request: Request, response: Response, next: NextFunction) => void
}