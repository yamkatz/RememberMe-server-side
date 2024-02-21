import { Router } from "express";
import { validateCard } from "../middleware/validation";
import { createCard } from "../service/card-service";
import { ICardInput } from "../@types/card";
import { BizCardsError } from "../error/biz-cards-error";
import { Card } from "../database/model/card";
import { validateToken } from "../middleware/validate-token";
import { Logger } from "../logs/logger";
import { isAdmin } from "../middleware/is-admin";
import { error } from "winston";

const router = Router();

//create new card
router.post(
  "/",
  validateToken,
  isAdmin,
  validateCard,
  async (req, res, next) => {
    try {
      const email = req.user?.email;

      if (!email) {
        Logger.error("Email is missing in JWT payload", 500, error);
      }

      const cardData: ICardInput = req.body;
      cardData.userId = req.user._id;

      const savedCard = await createCard(req.body as ICardInput, email);

      res
        .status(201)
        .json({ message: "Card created successfully", card: savedCard });
    } catch (e) {
      next(e);
    }
  }
);

//get all cards
router.get("/", async (req, res, next) => {
  try {
    const allCards = await Card.find();
    return res.json(allCards);
  } catch (e) {
    next(e);
  }
});

//get card by id
router.get("/:id", isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const card = await Card.findById(id);

    if (!card) {
      Logger.error("Card not found", 404, error);
      return res.status(404).json({ message: "Card not found" });
    }

    return res.json(card);
  } catch (e) {
    next(e);
  }
});

//edit card by id
router.put(
  "/:id",
  isAdmin,
  validateToken,
  validateCard,
  async (req, res, next) => {
    try {
      const cardId = req.params.id;

      const editCard = await Card.findOneAndUpdate({ _id: cardId }, req.body, {
        new: true,
      });

      if (!editCard) {
        throw new BizCardsError(
          "Unauthorized: You are not the creator of this card",
          403
        );
      }

      res.json({ card: editCard });
    } catch (e) {
      Logger.error("Internal Server Error", 500, error);
      next(e);
    }
  }
);

//remember/unremember a card
router.patch("/:id", validateToken, async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;

    const card = await Card.findById(cardId);

    if (!card) {
      throw new BizCardsError("Card not found", 404);
    }

    const alreadyRemembered = card.remembers.includes(userId);

    const update = alreadyRemembered
      ? { $pull: { remembers: userId } }
      : { $addToSet: { remembers: userId } };

    const options = { new: true };

    const updatedCard = await Card.findByIdAndUpdate(cardId, update, options);
    res.json({ card: updatedCard, remembered: !alreadyRemembered });
  } catch (e) {
    next(e);
  }
});

//delete a card
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const cardId = req.params.id;

    const deletedCard = await Card.findOneAndDelete({ _id: cardId });

    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    Logger.verbose("Deleted the card");

    return res.json(deletedCard);
  } catch (error) {
    console.error("Error deleting card:", error);
    next(error);
  }
});

export { router as cardsRouter };
