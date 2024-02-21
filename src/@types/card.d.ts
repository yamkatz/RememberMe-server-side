import { IName } from "./user";

export type ICardInput = {
  name: IName;
  age: number;
  city: string;
  description?: string;
  image?: IImage;
  casualtiesOfWar: string;
  userId: string;
};

type IImage = {
  url?: string;
  alt?: string;
};

export type ICard = ICardInput & {
  bizNumber?: number;
  _id?: ObjectId;
  remembers: ObjectId[];
  createdAt: Date;
};

export { ICard, ICardInput, IImage };
