import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/AppError";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
    profile?: string;
  }
}

type dataJwt = JwtPayload & { userId: string; profile: string };

  
export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      throw new AppError("Token não informado", 401);
    }

    const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt

    req.userId = Number(data.userId);
    req.profile = data.profile;

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError("Unknown error", 401));
    }
  }
};

export default verifyToken;
