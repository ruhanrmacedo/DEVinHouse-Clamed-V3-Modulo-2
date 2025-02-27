import { Router } from "express";
import { movementController } from "../controllers/MovementController";
import { verifyToken } from "../middlewares/auth";
import { authBranchOrDriver } from "../middlewares/authBranchOrDriver";

const movementRouter = Router();

movementRouter.post("/movements", verifyToken, movementController.createMovement);
movementRouter.get("/movements", authBranchOrDriver, movementController.listMovements);

export default movementRouter;
