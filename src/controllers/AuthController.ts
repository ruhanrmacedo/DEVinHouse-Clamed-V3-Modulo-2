import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import AppError from "../utils/AppError";

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Verificar se o email foi enviado
            if (!email || !password) {
                throw new AppError("E-mail e senha são obrigatórios", 400);
            }

            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOneBy({ email });

            // Se o usuário não existir, retorna erro
            if (!user) {
                throw new AppError("E-mail ou senha inválidos", 401);
            }

            // Comparar senha fornecida com hash armazenado
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new AppError("E-mail ou senha inválidos", 401);
            }

            // Criar Token JWT
            const token = jwt.sign(
                { userId: user.id, profile: user.profile },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            // Retorna os dados do usuário com o token
            res.status(200).json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    profile: user.profile,
                },
            });
            return;

        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
            return;
        }
    }
}
