import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IJWTPayload } from "../@types/user";
import { Logger } from "../logs/logger";

const authService = {
  hashPassword: async (plainTextPassword: string, rounds = 12) => {
    try {
      return await bcrypt.hash(plainTextPassword, rounds);
    } catch (error) {
      Logger.error("Error hashing password", 500, error);
    }
  },
  validatePassword: async (plainTextPassword: string, hash: string) => {
    try {
      return await bcrypt.compare(plainTextPassword, hash);
    } catch (error) {
      Logger.error("Error validating password", 500, error);
    }
  },
  generateJWT: (payload: IJWTPayload) => {
    try {
      const secret = process.env.JWT_SECRET!;
      return jwt.sign(payload, secret);
    } catch (error) {
      Logger.error("Error generating JWT", 500, error);
    }
  },
  verifyJWT: (token: string) => {
    try {
      const secret = process.env.JWT_SECRET!;
      return jwt.verify(token, secret) as IJWTPayload;
    } catch (error) {
      Logger.error("Error verifying JWT", 401, error);
    }
  },
};
export { authService as auth };
