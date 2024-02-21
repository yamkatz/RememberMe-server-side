import { ObjectId } from "mongoose";

type IName = {
  first: string;
  middle?: string;
  last: string;
};

type IAddress = {
  country: string;
  city: string;
  street: string;
  houseNumber: number;
};

type IUser = {
  name: IName;
  address: IAddress;
  phone: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date;
  _id?: string;
};

type ILogin = {
  email: string;
  password: string;
};

type IJWTPayload = {
  email: string;
};

export { IUser, IName, IAddress, ILogin, IJWTPayload };
