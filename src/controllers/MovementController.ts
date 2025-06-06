import { Request, Response } from "express";
import { MovementService } from "../services/MovementService";

export class MovementController {
    private movementService: MovementService;

    constructor() {
        this.movementService = new MovementService();
        this.createMovement = this.createMovement.bind(this);
        this.listMovements = this.listMovements.bind(this);
        this.startMovement = this.startMovement.bind(this);
        this.finishMovement = this.finishMovement.bind(this);
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

    async startMovement(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }

            const movementId = Number(req.params.id);
            const movement = await this.movementService.startMovement(req.userId, movementId);

            res.status(200).json(movement);
        } catch (error: any) {
            res.status(error.message.includes("Acesso negado") ? 401 :
                       error.message.includes("Movimentação não encontrada") ? 404 :
                       500).json({ message: error.message });
        }
    }

    async finishMovement(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }
    
            const movementId = Number(req.params.id);
            const movement = await this.movementService.finishMovement(req.userId, movementId);
    
            res.status(200).json({ message: "Movimentação finalizada com sucesso.", movement });
        } catch (error: any) {
            res.status(
                error.message.includes("Acesso negado") ? 401 :
                error.message.includes("Movimentação não encontrada") ? 404 :
                error.message.includes("MOTORISTA responsável") ? 403 :
                500
            ).json({ message: error.message });
        }
    }
    

}

export const movementController = new MovementController();
