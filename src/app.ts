import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import { handleError } from "./middlewares/handleError";
import productRouter from "./routes/product.routes";
import movementRouter from "./routes/movement.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", movementRouter);

app.use(handleError);

export default app;
