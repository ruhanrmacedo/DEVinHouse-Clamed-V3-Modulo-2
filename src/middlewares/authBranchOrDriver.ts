import { NextFunction, Request, Response } from "express";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import AppError from "../utils/AppError";
import { verifyToken } from "./auth";

export const authBranchOrDriver = (req: Request, res: Response, next: NextFunction) => {
    verifyToken(req, res, () => {
        if (req.profile === UserProfileEnum.BRANCH || req.profile === UserProfileEnum.DRIVER) {
            return next();
        }
        next(new AppError("Acesso negado. Apenas FILIAIS e MOTORISTAS podem visualizar movimentações.", 401));
    });
};
