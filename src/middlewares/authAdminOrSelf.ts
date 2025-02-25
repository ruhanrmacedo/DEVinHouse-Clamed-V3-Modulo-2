import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import AppError from "../utils/AppError";
import { verifyToken } from "./auth";

export const authAdminOrSelf = async (req: Request, res: Response, next: NextFunction) => {
    try {
        verifyToken(req, res, async () => {
            const userRepository = AppDataSource.getRepository(User);
            const loggedUser = await userRepository.findOneBy({ id: req.userId });

            if (!loggedUser) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const requestedUserId = parseInt(req.params.id, 10);

            if (loggedUser.profile === UserProfileEnum.ADMIN || loggedUser.id === requestedUserId) {
                return next();
            }

            return res.status(401).json({ message: "Acesso negado." });
        });
    } catch (error) {
        next(error);
    }
};
