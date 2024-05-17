const { Router } = require("express");

const {
  Create__CARD__Post,
  Delete__CARDS__Delete,
  Fetch__CARDS__Get,
} = require("../controllers/cardController");

const cardRouter = Router();

cardRouter.post("/", Create__CARD__Post);
cardRouter.get("/", Fetch__CARDS__Get);
cardRouter.delete("/:cardId", Delete__CARDS__Delete);

module.exports = { cardRouter };
