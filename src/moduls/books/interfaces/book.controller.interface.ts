import { NextFunction, Request, Response } from "express";

export interface IBookController {
    getAllBooks : (request: Request, response: Response, next: NextFunction) => void;
    getSingleBook : (request: Request, response: Response, next: NextFunction) => void;
    getSearchedBook : (request: Request, response: Response, next: NextFunction) => void
    // ONLY FOR ADMIN  
    // createBook : (request: Request, response: Response, next: NextFunction) => void 
    // deleteBook : (request: Request, response: Response, next: NextFunction) => void
    // updateBook : (request: Request, response: Response, next: NextFunction) => void
}