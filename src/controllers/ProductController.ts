import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
        this.createProduct = this.createProduct.bind(this);
    }

    async createProduct(req: Request, res: Response) {
        try {
            if (!req.userId) {
                res.status(401).json({ message: "Usuário não autenticado." });
                return;
            }

            const userId = req.userId;
            const product = await this.productService.createProduct(userId, req.body);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(error.message === "Acesso negado. Apenas FILIAIS podem cadastrar produtos."
                ? 401
                : 400
            ).json({ message: error.message });
        }
    }
}

export const productController = new ProductController();
