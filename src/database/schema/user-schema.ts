import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";
import { IName, IAddress } from "../../@types/user";
import { nameSchema } from "./name-schema";
import { addressSchema } from "./address-schema";

interface IUser extends Document {
  name: IName;
  address: IAddress;
  phone: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  createdAt?: Date;
  _id?: string;
  isValidPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: nameSchema,
  address: addressSchema,
  phone: {
    required: true,
    type: String,
    minlength: 9,
    maxlength: 15,
  },
  email: {
    unique: true,
    required: true,
    type: String,
    minlength: 7,
    maxlength: 50,
  },
  password: {
    required: true,
    type: String,
    minlength: 7,
    maxlength: 100,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: false,
    default: new Date(),
  },
});

userSchema.methods.isValidPassword = async function (password: string) {
  const user = this as IUser;
  const isValid = await bcrypt.compare(password, user.password);
  return isValid;
};

const User = model<IUser>("User", userSchema);
export { User, userSchema };
