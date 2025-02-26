import { Router } from "express";
import { productController } from "../controllers/ProductController";
import { verifyToken } from "../middlewares/auth";

const productRouter = Router();

productRouter.post("/products", verifyToken, productController.createProduct);

export default productRouter;
