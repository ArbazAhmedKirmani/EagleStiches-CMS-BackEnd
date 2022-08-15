const Order = require("./orderModel");
const User = require("../users/userModel");
const path = require("path");
const fs = require("fs");
const JSZip = require("jszip");
const PDFDocument = require("pdfkit");
const {
  SavedeleteOrUpdateFiles,
  sendEmail,
} = require("../../config/commonFunctions");

exports.createOrder = async (req, res) => {
  try {
    const {
      designFormat,
      orderMode,
      orderStatus,
      orderHistory,
      poNumber,
      createdBy,
      modifiedBy,
      isDeleted,
      deletedAt,
      deletedBy,
      designName,
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

    let characters = "0123456789";
    let result = "";
    let length = 4; // Customize the length here.
    for (let i = length; i > 0; --i)
      result += characters[Math.round(Math.random() * (characters.length - 1))];

    const date = new Date();

    const newOrderNumber =
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      "-ORD-" +
      result;

    const customer = await User.findById({ _id: customerId }).populate(
      "salesPerson"
    );

    let patches;
    let formates;
    if (patchCategory) {
      patches = patchCategory.split(",");
    }
    if (formats) {
      formates = formats.split(",");
    }

    const userId = req.user._id;
    const userRole = req.user.role;

    const fileUrls = [];

    const user = await User.findById({ _id: userId });

    const zip = new JSZip();
    const files = req?.files?.files;
    let filePath = "";

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
          filePath =
            path.join(__dirname, "../../../", "public") +
            "/" +
            `File_${randomName}.${expension}`;

          const temURlFile =
            req.protocol +
            "://" +
            req.get("host") +
            filePath.split(path.join(__dirname, "../../../", "public")).pop();

          fileUrls.push(temURlFile);

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
                  orderNumber: newOrderNumber,
                  designFormat,
                  orderMode,
                  orderStatus,
                  orderHistory,
                  poNumber,
                  uploadFileUrl: fileUrl_dataFillZip,
                  link: filePath,
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
                  orderfileUrls: fileUrls,
                  orderPdf: "",
                });
                await order.save();
                res.status(200).send({
                  status: "Ok",
                  message: "record created successfully",
                });

                sendEmail(
                  customer.email,
                  `<b> Your Order Details for the Design # ${order.designName} </b>`
                );

                if (customer.employeeEmails.length > 0) {
                  sendEmail(
                    customer.employeeEmails,
                    `<b> Your Order Details for the Design # ${order.designName} </b>`
                  );
                }
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
        orderNumber: newOrderNumber,
        designFormat,
        orderMode,
        orderStatus,
        orderHistory,
        poNumber,
        uploadFileUrl: "",
        link: filePath,
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
        orderfileUrls: fileUrls,
        orderPdf: "",
      });
      await order.save();
      res.status(200).send({
        status: "Ok",
        message: "record created successfully",
      });

      sendEmail(
        customer.email,
        `Order # ${order._id}`,
        ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # Price will be known once your order is Accepted <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}` // html body
      );

      if (customer.employeeEmails) {
        sendEmail(
          customer.employeeEmails,
          `Order # ${order._id}`,
          ` <b> Your Order Details for the Design # ${order.designName} </b> <br> <b>Price</b> # Price will be known once your order is Accepted <br> <b>Sales Person</b> # ${customer.salesPerson.salesPersonName}` // html body
        );
      }
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
    let {
      designFormat,
      price,
      salesPersonId,
      orderStatus,
      orderMode,
      orderHistory,
      poNumber,
      designName,
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
      orderfileUrls,
      uploadFileUrl,
    } = req.body;

    if (orderfileUrls) {
      console.log(orderfileUrls.split(","));
      orderfileUrls = orderfileUrls.split(",");
    } else {
      orderfileUrls = [];
    }

    let patches;
    let formates;
    if (patchCategory) {
      patches = patchCategory.split(",");
    }
    if (formats) {
      formates = formats.split(",");
    }
    const zip = new JSZip();
    const files = req?.files?.files;
    const zipFileName = uploadFileUrl.split("/")[3];
    const userId = req.user._id;
    // const salesPerson = await SalesPerson.findById({ _id: salesPersonId });
    const foundOrder = await Order.findById({ _id: id }).populate(
      "createdBy,salesPerson,customerId"
    );

    const recallOrders = async () => {
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
      let populate = "customerId";
      let sort = "";

      let totalCount = await Order.countDocuments({ ...findQuery });
      const order = await Order.find({ ...findQuery })
        .populate(populate)
        .skip(skip)
        .limit(top)
        .sort(sort);

      // send mail with defined transport object

      if (foundOrder.customerId.email !== undefined) {
        sendEmail(
          foundOrder.customerId.email,
          `Order # ${foundOrder._id}`,
          ` <b> Your Order Details for the Design # ${foundOrder.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${foundOrder.salesPerson?.salesPersonName}`
        );
      }

      if (foundOrder.customerId?.employeesEmail?.length > 0) {
        sendEmail(
          foundOrder.customerId?.employeesEmail,
          `Order # ${foundOrder._id}`,
          ` <b> Your Order Details for the Design # ${foundOrder.designName} </b> <br> <b>Price</b> # ${price} <br> <b>Sales Person</b> # ${foundOrder.salesPerson?.salesPersonName}`
        );
      }

      res.status(200).send({
        status: "Ok",
        message: "record updated successfully",
        data: order,
        count: totalCount,
      });
    };
    const updatesFiles = SavedeleteOrUpdateFiles(
      orderfileUrls,
      foundOrder.orderfileUrls,
      req,
      res
    );

    Promise.resolve(updatesFiles).then(async (pr) => {
      if (files?.length > 0) {
        const orderFileName = zipFileName;

        fs.unlink(
          path.join(__dirname, "../../../", "public") + "/" + orderFileName,
          (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: ", orderFileName);

              let zipFilePath =
                path.join(__dirname, "../../../", "public") +
                "/" +
                `${orderFileName}`;
              const fileUrl_dataFillZip =
                req.protocol +
                "://" +
                req.get("host") +
                zipFilePath
                  .split(path.join(__dirname, "../../../", "public"))
                  .pop();
              let storedFiles = [];
              const saveFile = new Promise((resolve, reject) => {
                files.map((file) => {
                  const randomName = (Math.random() + 1)
                    .toString(36)
                    .substring(7);
                  const expension = file.name.split(/[\s.]+/).pop();
                  filePath =
                    path.join(__dirname, "../../../", "public") +
                    "/" +
                    `File_${randomName}.${expension}`;

                  const temURlFile =
                    req.protocol +
                    "://" +
                    req.get("host") +
                    filePath
                      .split(path.join(__dirname, "../../../", "public"))
                      .pop();

                  pr.push(temURlFile);

                  file.mv(filePath, function (err) {
                    if (err) reject("Error");
                    console.log(
                      "******************* File Saved *******************"
                    );
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

              let newStoredFiles = [];
              pr.map((e) => {
                const pathFile = path.join(
                  __dirname,
                  "../../../",
                  "public",
                  `${e.split("/")[3]}`
                );
                const obj = {};
                obj.name = e.split("/")[3];
                obj.path = pathFile;
                newStoredFiles.push(obj);
              });
              saveFile
                .then((data) => {
                  newStoredFiles.map((storedFile) => {
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
                      let filesPaths = orderfileUrls;
                      if (pr.length > 0) {
                        filesPaths = pr;
                      }
                      try {
                        await Order.findOneAndUpdate(
                          { _id: id },
                          {
                            $set: {
                              designFormat: designFormat,
                              orderStatus: orderStatus,
                              price: price,
                              modifiedBy: userId,
                              uploadFileUrl: fileUrl_dataFillZip,
                              orderfileUrls: filesPaths,
                              orderMode,
                              orderHistory,
                              poNumber,
                              designName,
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
                              placement,
                              discount,
                              totalPrice,
                              quotationId,
                              freeOrder,
                              Invoiced,
                              customerId,
                              patchCategory: patches,
                              formats: formates,
                              orderPdf: "",
                            },
                          }
                        );

                        recallOrders();
                      } catch (err) {
                        console.log(
                          "*******************Error Check Server Logs*******************"
                        );
                        console.log(err);
                        res.status(400).send({
                          status: "Error",
                          message: "Invalid Form Fields",
                        });
                      }
                    });
                })
                .catch((err) => {
                  console.log(
                    "*******************Error Check Server Logs*******************"
                  );
                  console.log(err);
                  res.status(400).send({
                    status: "Error",
                    message: "Error Check Server Logs!",
                  });
                });
            }
          }
        );
      } else {
        const orderFileName = zipFileName;
        fs.unlink(
          path.join(__dirname, "../../../", "public") + "/" + orderFileName,
          (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: ", orderFileName);

              let zipFilePath =
                path.join(__dirname, "../../../", "public") +
                "/" +
                `${orderFileName}`;
              const fileUrl_dataFillZip =
                req.protocol +
                "://" +
                req.get("host") +
                zipFilePath
                  .split(path.join(__dirname, "../../../", "public"))
                  .pop();

              let newStoredFiles = [];
              pr.map((e) => {
                const pathFile = path.join(
                  __dirname,
                  "../../../",
                  "public",
                  `${e.split("/")[3]}`
                );
                const obj = {};
                obj.name = e.split("/")[3];
                obj.path = pathFile;
                newStoredFiles.push(obj);
              });

              newStoredFiles.map((storedFile) => {
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
                  let filesPaths = orderfileUrls;
                  if (pr.length > 0) {
                    filesPaths = pr;
                  }
                  try {
                    await Order.findOneAndUpdate(
                      { _id: id },
                      {
                        $set: {
                          designFormat: designFormat,
                          orderStatus: orderStatus,
                          price: price,
                          modifiedBy: userId,
                          uploadFileUrl: fileUrl_dataFillZip,
                          orderfileUrls: filesPaths,
                          orderMode,
                          orderHistory,
                          poNumber,
                          designName,
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
                          placement,
                          discount,
                          totalPrice,
                          quotationId,
                          freeOrder,
                          Invoiced,
                          customerId,
                          patchCategory: patches,
                          formats: formates,
                          orderPdf: "",
                        },
                      }
                    );
                    recallOrders();
                  } catch (err) {
                    console.log(
                      "*******************Error Check Server Logs*******************"
                    );
                    console.log(err);
                    res.status(400).send({
                      status: "Error",
                      message: "Invalid Form Fields",
                    });
                  }
                });
            }
          }
        );
      }
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

    const order = await Order.findOne({ _id: id }).populate("customerId");

    let filePath =
      path.join(__dirname, "../../../", "public") +
      "/" +
      `Order_${order.orderNumber}.pdf`;
    const fileUrl =
      req.protocol +
      "://" +
      req.get("host") +
      filePath.split(path.join(__dirname, "../../../", "public")).pop();

    var pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(filePath));

    pdfDoc.text("OrderNumber: ", 30, 30);
    pdfDoc.text(`${order.orderNumber}`, 150, 30);

    pdfDoc.text("Design Format: ", 30, 50);
    pdfDoc.text(
      `${order.designFormat !== undefined ? order.designFormat : ""}`,
      150,
      50
    );

    pdfDoc.text("Order Status: ", 30, 70);
    pdfDoc.text(`${order.orderStatus && order.orderStatus}`, 150, 70);

    pdfDoc.text("Price: ", 30, 90);
    pdfDoc.text(`${order.price && order.price}`, 150, 90);

    pdfDoc.text("Total Price: ", 30, 110);
    pdfDoc.text(`${order.totalPrice && order.totalPrice}`, 150, 110);

    pdfDoc.text("Order Mode: ", 30, 130);
    pdfDoc.text(`${order.orderMode && order.orderMode}`, 150, 130);

    pdfDoc.text("Height: ", 30, 150);
    pdfDoc.text(`${order.dimensionHeight && order.dimensionHeight}`, 150, 150);

    pdfDoc.text("Weight: ", 30, 170);
    pdfDoc.text(`${order.dimensionWeight && order.dimensionWeight}`, 150, 170);

    pdfDoc.text("Shape: ", 30, 190);
    pdfDoc.text(`${order.shape && order.shape}`, 150, 190);

    pdfDoc.text("Order Type: ", 30, 210);
    pdfDoc.text(`${order.orderType && order.orderType}`, 150, 210);

    pdfDoc.text("Placement: ", 30, 230);
    pdfDoc.text(
      `${order.placement !== undefined ? order.placement : ""}`,
      150,
      230
    );

    pdfDoc.text("Free Order: ", 30, 250);
    pdfDoc.text(
      `${order.freeOrder !== undefined ? order.freeOrder : ""}`,
      150,
      250
    );

    pdfDoc.end();

    await Order.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          orderPdf: fileUrl,
        },
      }
    );

    res.status(200).send({
      status: "Ok",
      message: "record updated successfully",
      url: fileUrl,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
