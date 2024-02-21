import { ICard } from "../../@types/card";
import { Schema } from "mongoose";
import { imageSchema } from "./image-schema";
import { nameSchema } from "./name-schema";

const cardSchema = new Schema<ICard>({
  name: { type: nameSchema, required: true },
  age: { type: Number, required: true, min: 1, max: 100 },
  city: { type: String, required: true, minlength: 2, maxlength: 50 },
  description: { type: String, default: "" },
  image: { type: imageSchema },
  casualtiesOfWar: { type: String, default: "" },

  userId: { type: String, required: true },
  bizNumber: {
    type: Number,
    default: () => Math.round(Math.random() * 1_000_000),
    unique: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  remembers: [
    {
      type: String,
    },
  ],
});

export { cardSchema };
