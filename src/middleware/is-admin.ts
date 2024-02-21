import { RequestHandler, Request, Response, NextFunction } from "express";
import { BizCardsError } from "../error/biz-cards-error";
import { User } from "../database/model/user";
import { IJWTPayload } from "../@types/user";
import jwt from "jsonwebtoken";

const extractToken = (req: Request): string => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    throw new BizCardsError("Token is missing in Authorization header", 400);
  }
  return authHeader.substring(7);
};
const validateToken: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as IJWTPayload;
    if (!decodedPayload || !decodedPayload.email) {
      throw new BizCardsError("Invalid JWT payload", 400);
    }
    const user = await User.findById({ email: decodedPayload.email });
    if (!user) {
      throw new BizCardsError("User not found for the given token", 401);
    }
    req.user = { ...user.toObject(), _id: user._id };
    next();
  } catch (error) {
    next(error);
  }
};
const isAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    const decodedPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as IJWTPayload;
    if (!decodedPayload || !decodedPayload.email) {
      throw new BizCardsError("Email is missing in JWT payload", 401);
    }
    const user = await User.findOne({ email: decodedPayload.email });
    if (!user) {
      throw new BizCardsError("User does not exist", 401);
    }
    if (!user.isAdmin) {
      throw new BizCardsError("Must be admin", 401);
    }
    next();
  } catch (error) {
    next(error);
  }
};
export { validateToken, isAdmin, extractToken };
