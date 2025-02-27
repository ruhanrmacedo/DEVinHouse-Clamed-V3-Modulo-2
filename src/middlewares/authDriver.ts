import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import { verifyToken } from "./auth";

export const authDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        verifyToken(req, res, async () => {
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({ where: { id: req.userId } });

            if (!user || user.profile !== UserProfileEnum.DRIVER) {
                return res.status(403).json({ message: "Acesso negado. Apenas MOTORISTAS podem acessar este recurso." });
            }

            next();
        });
    } catch (error) {
        next(error);
    }
};
