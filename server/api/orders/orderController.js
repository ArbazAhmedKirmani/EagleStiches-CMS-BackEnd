const Order = require("./orderModel");
const User = require("../users/userModel");
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
      discount,
      totalPrice,
      quotationId,
      formats,
      freeOrder,
      Invoiced,
      customerId,
    } = req.body;

    const customer = await User.findById({ _id: customerId });

    const patches = patchCategory.split(",");
    const formates = formats.split(",");

    const userId = req.user._id;
    const userRole = req.user.role;

    const user = await User.findById({ _id: userId });

    const zip = new JSZip();
    const files = req?.files?.files;

    if (files?.length > 0) {
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
                  format: formates,
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
                  patchCategory: patches,
                  placement,
                  salesPerson: user.salesPerson ? user.salesPerson : null,
                  createdBy: userId,
                  modifiedBy,
                  isDeleted: false,
                  deletedAt,
                  deletedBy,
                  discount,
                  totalPrice,
                  quotationId,
                  formats,
                  freeOrder,
                  Invoiced,
                  customerId,
                });
                await order.save();
                res.status(200).send({
                  status: "Ok",
                  message: "record created successfully",
                });

                await transporter.sendMail({
                  from: "Eagle Stiches", // sender address
                  to: customer.email, // list of receivers
                  subject: `Order # ${order._id}`, // Subject line
                  html: ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}`, // html body
                });

                await transporter.sendMail({
                  from: "Eagle Stiches", // sender address
                  to: customer.employeeEmails, // list of receivers
                  subject: `Order # ${order._id}`, // Subject line
                  html: ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}`, // html body
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
        format: formates,
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
        patchCategory: patches,
        placement,
        salesPerson: user.salesPerson ? user.salesPerson : null,
        createdBy: userId,
        modifiedBy,
        isDeleted: false,
        deletedAt,
        deletedBy,
        discount,
        totalPrice,
        quotationId,
        formats,
        freeOrder,
        Invoiced,
        customerId,
      });
      await order.save();
      res.status(200).send({
        status: "Ok",
        message: "record created successfully",
      });
    }
    await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: customer.email, // list of receivers
      subject: `Order # ${order._id}`, // Subject line
      html: ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}`, // html body
    });

    await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: customer.employeeEmails, // list of receivers
      subject: `Order # ${order._id}`, // Subject line
      html: ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}`, // html body
    });
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

    const Orders = await Order.findById({ _id: id }).populate(populate);

    res.status(200).send({ status: "Ok", data: Orders });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { designFormat, price, salesPersonId, orderStatus } = req.body;
    const userId = req.user._id;
    // const salesPerson = await SalesPerson.findById({ _id: salesPersonId });
    const foundOrder = await Order.findById({ _id: id }).populate(
      "createdBy,salesPerson,customerId"
    );

    await Order.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          designFormat: designFormat,
          orderStatus: orderStatus,
          price: price,
          // salesPerson: salesPersonId,
          modifiedBy: userId,
        },
      }
    );

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          salesPerson: salesPersonId,
        },
      }
    );

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "createdBy";
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
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailerConfig.email, // generated ethereal user
        pass: mailerConfig.password, // generated ethereal password
      },
    });

    // send mail with defined transport object
    foundOrder.customerId?.email && await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: foundOrder.customerId?.email, // list of receivers
      subject: `Order # ${foundOrder._id}`, // Subject line
      html: ` <b> Your Order Details for the Design # ${foundOrder.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${foundOrder.salesPerson?.salesPersonName}`, // html body
    });

    foundOrder.customerId?.employeesEmail && await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: foundOrder.customerId?.employeesEmail,// list of receivers
      subject: `Order # ${foundOrder._id}`, // Subject line
      text: `Your Order Details for the Design # ${foundOrder.designName}`, // plain text body
      html: `<b> Your Order Details for the Design # ${foundOrder.designName} </b> <br> <b>Order Files</b> # ${foundOrder.uploadFileUrl}`, // html body
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

exports.updateOrderStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const userId = req.user._id;

    await Order.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          orderStatus: orderStatus,
          modifiedBy: userId,
        },
      }
    );

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "createdBy";
    let sort = "";

    let totalCount = await Order.countDocuments({ ...findQuery });
    const order = await Order.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    // Send confirmation Email

    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: mailerConfig.email, // generated ethereal user
    //     pass: mailerConfig.password, // generated ethereal password
    //   },
    // });

    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //   from: "Eagle Stiches", // sender address
    //   to: foundOrder.createdBy.email, // list of receivers
    //   subject: `Order # ${foundOrder._id}`, // Subject line
    //   text: `Your Order Details for the Design # ${foundOrder.designName}`, // plain text body
    //   html: `<b>Price</b> # ${price} <br> <b>Sales Person</b> # ${salesPerson.salesPersonName}`, // html body
    // });

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

exports.generateOrderPdf = async (req, res) => {
  try {
    const { id } = req.params;

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
