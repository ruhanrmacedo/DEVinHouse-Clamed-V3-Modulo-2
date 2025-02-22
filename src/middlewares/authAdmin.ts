import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";
import AppError from "../utils/AppError";
import { verifyToken } from "./auth";



export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    verifyToken(req, res, async () => {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({ id: req.userId });

      if (!user) {
        throw new AppError("Usuário não encontrado", 401);
      }

      if (user.profile !== UserProfileEnum.ADMIN) {
        throw new AppError("Acesso negado. Apenas ADMIN pode cadastrar usuários", 403);
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};
