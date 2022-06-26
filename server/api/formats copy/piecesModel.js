const mongoose = require("mongoose");

const PiecesModel = mongoose.Schema(
  {
    pieceName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Piece = mongoose.model("pieces", PiecesModel);

module.exports = Piece;
