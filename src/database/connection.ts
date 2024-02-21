import { Logger } from "../logs/logger";
import { initDB } from "./initDB";
import mongoose from "mongoose";
import { error } from "console";

const connect = async () => {
  try {
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (!connectionString) {
      Logger.error(
        "DB_CONNECTION_STRING IS NOT DEFINED IN your .env file",
        0,
        error
      );
      return;
    }
    await mongoose.connect(connectionString);

    //blue:
    Logger.debug("Database Connected");
    //init the database:
    await initDB();
  } catch (err) {
    Logger.error("Error Connecting to database", 500, err);
  }
};

export { connect };
