const Quotation = require("./quotationModel");
const User = require("../users/userModel");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const mailerConfig = require("../../utils/serviceVariables");
const nodemailer = require("nodemailer");

exports.createQuotation = async (req, res) => {
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
      formats,
      freeOrder,
    } = req.body;

    const userId = req.user._id;
    const userRole = req.user.role;

    const user = await User.findById({ _id: userId });

    const zip = new JSZip();
    const files = req?.files?.files;

    if (files?.length > 0) {
      const quotationFileName = (Math.random() + 1).toString(36).substring(7);
      let zipFilePath =
        path.join(__dirname, "../../../", "public") +
        "/" +
        `quotationFiles_${quotationFileName}` +
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
                const quotation = new Quotation({
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
                  salesPerson: user.salesPerson ? user.salesPerson : null,
                  createdBy: userId,
                  modifiedBy,
                  isDeleted: false,
                  deletedAt,
                  deletedBy,
                  discount,
                  totalPrice,
                  formats,
                  freeOrder,
                });
                await quotation.save();
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
      const quotation = new Quotation({
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
        salesPerson: user.salesPerson ? user.salesPerson : null,
        createdBy: userId,
        modifiedBy,
        isDeleted: false,
        deletedAt,
        deletedBy,
        discount,
        totalPrice,
        formats,
        freeOrder,
      });
      await quotation.save();
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

exports.getAllQuotations = async (req, res) => {
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
    let totalCount = await Quotation.countDocuments({ ...findQuery });
    const quotations = await Quotation.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: quotations,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    let findQuery = { isDeleted: false };
    let populate = "";

    if (req.query.populate) {
      populate = req.query.populate;
    }

    const quotation = await Quotation.findById({ _id: id }).populate(populate);

    res.status(200).send({ status: "Ok", data: quotation });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.updateQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      designFormat,
      orderMode,
      orderStatus,
      orderHistory,
      poNumber,
      uploadFileUrl,
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
      salesPerson,
      discount,
      totalPrice,
      formats,
      freeOrder,
    } = req.body;
    const userId = req.user._id;
    const foundQuotation = await Quotation.findById({ _id: id }).populate(
      "createdBy"
    );

    await Quotation.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          designFormat,
          orderMode,
          orderStatus,
          orderHistory,
          poNumber,
          uploadFileUrl,
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
          salesPerson,
          discount,
          totalPrice,
          formats,
          freeOrder,
          modifiedBy: userId,
        },
      }
    );

    let findQuery = { isDeleted: false };
    let top = 10;
    let skip = 0;
    let populate = "createdBy";
    let sort = "";

    let totalCount = await Quotation.countDocuments({ ...findQuery });
    const quotation = await Quotation.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    // Send confirmation Email

    // create reusable transporter object using the default SMTP transport
    if (req.user.role === "Super Admin") {
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
      await transporter.sendMail({
        from: "Eagle Stiches", // sender address
        to: foundQuotation.createdBy.email, // list of receivers
        subject: `Quotation # ${foundQuotation._id}`, // Subject line
        html: ` <b> Your Order Details for the Design # ${foundQuotation.designName} </b> <br> <b>Price</b> # ${price} <br>`, // html body
      });
    }

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      data: quotation,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.deleteQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const date = new Date();
    const userId = req.user._id;
    await Quotation.findOneAndUpdate(
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

    let totalCount = await Quotation.countDocuments({ ...findQuery });
    const quotation = await Quotation.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      message: "record deleted successfully",
      data: quotation,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
