import Joi, { ObjectSchema } from "joi";
import { IName, IUser, IAddress } from "../@types/user";
import { passwordRegex, phoneRegex } from "./patterns";
import { Request, Response, NextFunction } from "express";
import { validateSchema } from "../middleware/validation/validate-schema";

const schema: ObjectSchema<IUser> = Joi.object<IUser>({
  name: Joi.object<IName>({
    first: Joi.string().min(2).max(20).required(),
    middle: Joi.string().allow("").optional(),
    last: Joi.string().min(2).max(20).required(),
  }).required(),
  address: Joi.object<IAddress>({
    country: Joi.string().min(2).max(50).required(),
    city: Joi.string().min(2).max(50).required(),
    street: Joi.string().min(2).max(50).required(),
    houseNumber: Joi.number().min(1).max(999).required(),
  }).required(),
  phone: Joi.string().pattern(phoneRegex).min(9).max(15).required(),
  email: Joi.string().email().min(7).max(50).required(),
  password: Joi.string().pattern(passwordRegex).min(7).max(100).required(),
});

const validateRegistration = [
  validateSchema(schema),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
];

export { schema as joiUserSchema, validateRegistration };
