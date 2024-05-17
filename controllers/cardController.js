const { Card } = require("../models/card");

const Create__CARD__Post = async (req, res) => {
  try {
    const cards = await Card.find().populate("sections");

    return res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};

const Fetch__CARDS__Get = async (req, res) => {
  try {
    const user = req.user;
    const cards = await Card.find({ owner: user?._id });

    return res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};
const Delete__CARDS__Delete = async (req, res) => {
  try {
    const cardId = req.cardId;
    await Card.findByIdAndDelete(cardId);

    const cards = await Card.find({ owner: user?._id });
    return res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Internal server error" });
  }
};

module.exports = {
  Create__CARD__Post,
  Fetch__CARDS__Get,
  Delete__CARDS__Delete,
};
