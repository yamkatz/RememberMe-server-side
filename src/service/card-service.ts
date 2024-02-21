import { Card } from "../database/model/card";
import { ICardInput } from "./../@types/card.d";
import { Logger } from "../logs/logger";

const createCard = async (data: ICardInput, email: string) => {
  try {
    const card = new Card({ ...data, userEmail: email });

    while (true) {
      const random = Math.floor(Math.random() * 1_000_000);
      const dbRes = await Card.findOne({ bizNumber: random });
      if (!dbRes) {
        card.bizNumber = random;
        break;
      }
    }
    return card.save();
  } catch (error) {
    Logger.error("Error creating card", 500, error);
  }
};

export { createCard };
