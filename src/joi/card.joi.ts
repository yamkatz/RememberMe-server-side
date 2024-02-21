import Joi, { ObjectSchema } from "joi";
import { ICard } from "../@types/card";
import { IName } from "../@types/user";
import { IImage } from "../@types/card";
import { validateSchema } from "../middleware/validation/validate-schema";
import { Request, Response, NextFunction } from "express";

const schema: ObjectSchema<ICard> = Joi.object<ICard>({
  name: Joi.object<IName>({
    first: Joi.string().min(2).max(20).required(),
    middle: Joi.string().allow("").optional().max(20),
    last: Joi.string().min(2).max(20).required(),
  }),
  age: Joi.number().min(1).max(100).required(),
  city: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow("").optional(),
  image: Joi.object<IImage>({
    url: Joi.string()
      .allow("")
      .uri()
      .max(200)
      .default(
        "https://img.freepik.com/free-photo/one-romance-romantic-candle-memorial_1232-3535.jpg?w=900&t=st=1707812351~exp=1707812951~hmac=fd6cb9c86cb23685672320f383732de5e97b2fce1f713ee71ee490eccfbe14ff"
      ),
    alt: Joi.string().allow("").max(20).default("profile"),
  }),
  casualtiesOfWar: Joi.string().allow("").optional(),
  userId: Joi.string().required(),
});

const validateCard = [
  validateSchema(schema),
  (req: Request, res: Response, next: NextFunction) => {
    next();
  },
];

export { schema as joiCardSchema, validateCard };
