import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    private userService = new UserService();

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
}
