import { Router } from "express";
import { authAdmin } from "../middlewares/authAdmin";
import { userController } from "../controllers/UserController";

const userRouter = Router();

userRouter.post("/users", authAdmin, userController.createUser);
userRouter.get("/users", authAdmin, userController.listUsers);

export default userRouter;
