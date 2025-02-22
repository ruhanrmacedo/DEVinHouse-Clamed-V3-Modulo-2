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
        res.status(401).json({ message: "Usuário não encontrado" });
        return;
      }

      if (user.profile !== UserProfileEnum.ADMIN) {
        res.status(403).json({ message: "Acesso negado. Apenas ADMIN pode cadastrar usuários" });
        return;
    }

      next();
    });
  } catch (error) {
    next(error);
  }
};
