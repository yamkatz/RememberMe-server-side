import { Schema } from "mongoose";
import { IImage } from "../../@types/card";

const imageSchema = new Schema<IImage>({
  url: {
    type: String,
    minlength: 0,
    maxlength: 200,
    required: false,
    default:
      "https://img.freepik.com/free-photo/one-romance-romantic-candle-memorial_1232-3535.jpg?w=900&t=st=1707812351~exp=1707812951~hmac=fd6cb9c86cb23685672320f383732de5e97b2fce1f713ee71ee490eccfbe14ff",
  },
  alt: {
    type: String,
    minlength: 0,
    maxlength: 20,
    required: false,
    default: "profile",
  },
});

export { imageSchema };
