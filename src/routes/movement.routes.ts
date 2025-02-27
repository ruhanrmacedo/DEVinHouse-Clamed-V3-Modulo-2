import { Router } from "express";
import { movementController } from "../controllers/MovementController";
import { verifyToken } from "../middlewares/auth";
import { authBranchOrDriver } from "../middlewares/authBranchOrDriver";
import { authDriver } from "../middlewares/authDriver";

const movementRouter = Router();

movementRouter.post("/movements", verifyToken, movementController.createMovement);
movementRouter.get("/movements", authBranchOrDriver, movementController.listMovements);
movementRouter.patch("/movements/:id/start", authDriver, movementController.startMovement);

export default movementRouter;
