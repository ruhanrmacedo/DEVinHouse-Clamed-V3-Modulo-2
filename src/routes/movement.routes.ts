import { Router } from "express";
import { movementController } from "../controllers/MovementController";
import { verifyToken } from "../middlewares/auth";

const movementRouter = Router();

movementRouter.post("/movements", verifyToken, movementController.createMovement);

export default movementRouter;
