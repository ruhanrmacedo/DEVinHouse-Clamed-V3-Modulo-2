import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserProfileEnum } from "../entities/enums/UserProfileEnum";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.createUser = this.createUser.bind(this);
        this.listUsers = this.listUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }

    async createUser(req: Request, res: Response) {
        try {
            const newUser = await this.userService.createUser(req.body);
            res.status(201).json({ name: newUser.name, profile: newUser.profile });
            return;
        } catch (error: any) {
            if (error.message === "E-mail já cadastrado") {
                res.status(409).json({ message: error.message });
                return;
            }
            res.status(400).json({ message: error.message });
            return;
        }
    }

    async listUsers(req: Request, res: Response) {
        try {
            const profile = req.query.profile ? (req.query.profile as UserProfileEnum) : undefined;
            const users = await this.userService.listUsers(profile);
            res.status(200).json(users);
        } catch (error: any) {
            console.error(error); 
            res.status(500).json({ message: "Erro ao listar usuários" });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error: any) {
            console.error(error);
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    }
}

export const userController = new UserController();
