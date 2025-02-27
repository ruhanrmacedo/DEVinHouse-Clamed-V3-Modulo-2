import { Request, Response } from "express";
import { MovementService } from "../services/MovementService";

export class MovementController {
    private movementService: MovementService;

    constructor() {
        this.movementService = new MovementService();
        this.createMovement = this.createMovement.bind(this);
        this.listMovements = this.listMovements.bind(this);
    }

    async createMovement(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }

            const userId = req.userId;
            const { destination_branch_id, product_id, quantity } = req.body;

            const movement = await this.movementService.createMovement(userId, {
                destination_branch_id,
                product_id,
                quantity,
            });

            res.status(201).json(movement);
        } catch (error: any) {
            res.status(error.message.includes("Estoque insuficiente") ||
                error.message.includes("A filial de origem não pode ser a mesma que a filial de destino") ||
                error.message.includes("Apenas a filial que possui o produto pode movimentá-lo.")
                ? 400
                : 401
            ).json({ message: error.message });
        }
    }

    async listMovements(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }

            const movements = await this.movementService.listMovements(req.userId);
            res.status(200).json(movements);
        } catch (error: any) {
            res.status(error.message.includes("Acesso negado") ? 401 : 500).json({ message: error.message });
        }
    }

}

export const movementController = new MovementController();
