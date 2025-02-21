import { Router } from "express";
import { authAdmin } from "../middlewares/authAdmin";
import { UserController } from "../controllers/UserController";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/users", authAdmin, userController.createUser);

export default userRouter;
