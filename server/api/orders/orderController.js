const Order = require("./orderModel");
const SalesPerson = require("../salesPerson/salePersonModel");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const mailerConfig = require("../../utils/serviceVariables");
const nodemailer = require("nodemailer");

exports.createOrder = async (req, res) => {
  try {
    const {
      designFormat,
      orderMode,
      orderStatus,
      orderHistory,
      poNumber,
      link,
      createdBy,
      modifiedBy,
      isDeleted,
      deletedAt,
      deletedBy,
      designName,
      format,
      dimensionHeight,
      dimensionWeight,
      numberOfColor,
      fabric,
      additionalInformation,
      isRushOrder,
      isBlending,
      orderType,
      numberOfPieces,
      shape,
      patchCategory,
      placement,
    } = req.body;

    const userId = req.user._id;
    const userRole = req.user.role;

    const zip = new JSZip();
    const files = req.files.files;

    if (files.length > 0) {
      const orderFileName = (Math.random() + 1).toString(36).substring(7);
      let zipFilePath =
        path.join(__dirname, "../../../", "public") +
        "/" +
        `orderFiles_${orderFileName}` +
        ".zip";
      const fileUrl_dataFillZip =
        req.protocol +
        "://" +
        req.get("host") +
        zipFilePath.split(path.join(__dirname, "../../../", "public")).pop();
      const storedFiles = [];
      const saveFile = new Promise((resolve, reject) => {
        files.map((file) => {
          const randomName = (Math.random() + 1).toString(36).substring(7);
          const expension = file.name.split(/[\s.]+/).pop();
          const filePath = path.join(
            __dirname,
            "../../../",
            "public",
            `File_${randomName}.${expension}`
          );

          file.mv(filePath, function (err) {
            if (err) reject("Error");
            console.log("******************* File Saved *******************");
            storedFiles.push({
              path: filePath,
              name: `File_${randomName}.${expension}`,
            });
            if (storedFiles.length === files.length) {
              resolve("Resolved");
            }
          });
        });
      });
      saveFile
        .then((data) => {
          storedFiles.map((storedFile) => {
            zip.file(storedFile.name, fs.readFileSync(storedFile.path));
          });

          zip
            .generateNodeStream({
              type: "nodebuffer",
              streamFiles: true,
            })
            .pipe(fs.createWriteStream(zipFilePath))
            .on("finish", async function () {
              // JSZip generates a readable stream with a "end" event,
              // but is piped here in a writable stream which emits a "finish" event.
              try {
                const order = new Order({
                  $inc: { orderNumber: 1 },
                  designFormat,
                  orderMode,
                  orderStatus,
                  orderHistory,
                  poNumber,
                  uploadFileUrl: fileUrl_dataFillZip,
                  link,
                  designName,
                  format,
                  dimensionHeight,
                  dimensionWeight,
                  numberOfColor,
                  fabric,
                  additionalInformation,
                  isRushOrder,
                  isBlending,
                  orderType,
                  numberOfPieces,
                  shape,
                  patchCategory,
                  placement,
                  createdBy: userId,
                  modifiedBy,
                  isDeleted: false,
                  deletedAt,
                  deletedBy,
                });
                await order.save();
                res.status(200).send({
                  status: "Ok",
                  message: "record created successfully",
                });
              } catch (err) {
                console.log(
                  "*******************Error Check Server Logs*******************"
                );
                console.log(err);
                res
                  .status(400)
                  .send({ status: "Error", message: "Invalid Form Fields" });
              }
            });
        })
        .catch((err) => {
          console.log(
            "*******************Error Check Server Logs*******************"
          );
          console.log(err);
          res
            .status(400)
            .send({ status: "Error", message: "Error Check Server Logs!" });
        });
    } else {
      const order = new Order({
        $inc: { orderNumber: 1 },
        designFormat,
        orderMode,
        orderStatus,
        orderHistory,
        poNumber,
        uploadFileUrl: "",
        link,
        designName,
        format,
        dimensionHeight,
        dimensionWeight,
        numberOfColor,
        fabric,
        additionalInformation,
        isRushOrder,
        isBlending,
        orderType,
        numberOfPieces,
        shape,
        patchCategory,
        placement,
        createdBy: userId,
        modifiedBy,
        isDeleted: false,
        deletedAt,
        deletedBy,
      });
      await order.save();
      res.status(200).send({
        status: "Ok",
        message: "record created successfully",
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    if (req.query.name) {
      let regex = new RegExp(req.query.name);
      findQuery.name = { $regex: regex };
    }
    if (req.query.userId) {
      let regex = new RegExp(req.query.name);
      findQuery.createdBy = req.query.userId;
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
    let totalCount = await Order.countDocuments({ ...findQuery });
    const order = await Order.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: order,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let findQuery = { isDeleted: false };
    let populate = "";

    if (req.query.populate) {
      populate = req.query.populate;
    }

    const Order = await Order.findById({ _id: id }).populate(populate);

    res.status(200).send({ status: "Ok", data: Order });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { designFormat, orderMode, orderStatus, price, salesPersonId } =
      req.body;
    const userId = req.user._id;
    // console.log(id);
    if (salesPersonId === undefined) {
      const salePer = await SalesPerson.find({ isDeleted: false });
      res.status(400).send({
        status: "ErrorSalesPerson",
        message: "Please define Sales Person to CUstomer and try again",
        data: salePer,
      });
      return;
    }

    const foundOrder = await Order.findById({ _id: req.body._id }).populate(
      "createdBy"
    );
    const salesPerson = await SalesPerson.findById({ _id: salesPersonId });

    await Order.findOneAndUpdate(
      { _id: req.user._id },
      {
        designFormat,
        orderMode,
        orderStatus,
        price,
        salesPerson: salesPersonId,
        modifiedBy: userId,
      }
    );

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await Order.countDocuments({ ...findQuery });
    const order = await Order.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    // Send confirmation Email

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mailerConfig.email, // generated ethereal user
        pass: mailerConfig.password, // generated ethereal password
      },
    });

    // // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: foundOrder.createdBy.email, // list of receivers
      subject: `Order # ${foundOrder._id}`, // Subject line
      text: `Your Order Details for the Design # ${foundOrder.designName}`, // plain text body
      html: `<b>Price</b> # ${price} <br> <b>Sales Person</b> # ${salesPerson.salesPersonName}`, // html body
    });

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: order,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const userId = req.user._id;
    await Order.findOneAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: date,
        deletedBy: userId,
        status: "deactivated",
      }
    );

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "";
    let sort = "";

    let totalCount = await Order.countDocuments({ ...findQuery });
    const order = await Order.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record deleted successfully",
      data: order,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
