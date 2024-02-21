import { Schema } from "mongoose";
import { IAddress } from "../../@types/user";

const addressSchema = new Schema<IAddress>({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  street: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },

  houseNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 999,
  },
});

export { addressSchema };
