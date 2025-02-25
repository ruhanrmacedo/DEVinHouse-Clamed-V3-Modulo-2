import { Router } from "express";
import { authAdmin } from "../middlewares/authAdmin";
import { userController } from "../controllers/UserController";
import { authAdminOrSelf } from "../middlewares/authAdminOrSelf";

const userRouter = Router();

userRouter.post("/users", authAdmin, userController.createUser);
userRouter.get("/users", authAdmin, userController.listUsers);
userRouter.get("/users/:id", authAdminOrSelf, userController.getUserById);

export default userRouter;
