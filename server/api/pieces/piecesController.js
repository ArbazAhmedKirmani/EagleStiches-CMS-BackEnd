const Piece = require("./piecesModel");
const Order = require("../orders/orderModel");

exports.createPiece = async (req, res) => {
  try {
    const { pieceName } = req.body;
    const piece = new Piece({
      pieceName,
    });
    await piece.save();
    res.status(200).send({
      status: "Ok",
      message: "record created successfully",
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllPieces = async (req, res) => {
  try {
    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.name) {
      let regex = new RegExp(req.query.name);
      findQuery.name = { $regex: regex };
    }
    if (req.query.populate) {
      populate = req.query.populate;
    }

    if (req.query.top) {
      top = parseInt(req.query.top);
    }
    if (req.query.skip) {
      skip = parseInt(req.query.skip);
    }

    if (req.query.sort) {
      sort = req.query.sort;
    }
    let totalCount = await Piece.countDocuments({ ...findQuery });
    const piece = await Piece.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: piece,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getPieceById = async (req, res) => {
  try {
    const { id } = req.params;
    const piece = await Piece.findById({ _id: id });
    res.status(200).send({ status: "Ok", data: piece });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updatePieceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { pieceName } = req.body;
    await Piece.findOneAndUpdate({ _id: id }, { pieceName });

    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await Piece.countDocuments({ ...findQuery });
    const piece = await Piece.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: piece,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deletePieceById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ Piece: id });
    if (order) {
      res.status(400).send({ status: "Error", message: "record exist!" });
    } else {
      await Piece.findByIdAndDelete({ _id: id });
      let findQuery = {};
      let top = 10;
      let skip = 0;
      let populate = "";
      let sort = "";

      let totalCount = await Piece.countDocuments({ ...findQuery });
      const piece = await Piece.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort);

      res.status(200).send({
        status: "Ok",
        message: "record deleted successfully",
        data: piece,
        count: totalCount,
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
