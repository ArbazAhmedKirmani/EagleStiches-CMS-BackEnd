const Invoice = require("./invoiceModel");
const Order = require("../orders/orderModel");
const User = require("../users/userModel");
const { createInvoice } = require("../../utils/createInvoice");
const path = require("path");

exports.createInvoices = async (req, res) => {
  try {
    let characters = "0123456789";
    let result = "";
    let length = 4; // Customize the length here.
    for (let i = length; i > 0; --i)
      result += characters[Math.round(Math.random() * (characters.length - 1))];

    const date = new Date();

    const invocieNumber =
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      "-INV-" +
      result;

    const { customer, dateFrom, dateTo, userId } = req.body;

    const findQuery = {
      customerId: customer,
      orderStatus: "delivered",
      isInvoiced: false,
    };

    const user = await User.find({ _id: customer });

    let invoiceFilePath =
      path.join(__dirname, "../../../", "public") +
      "/" +
      invocieNumber +
      ".pdf";

    const fileUrl =
      req.protocol +
      "://" +
      req.get("host") +
      invoiceFilePath.split(path.join(__dirname, "../../../", "public")).pop();

    // if (dateFrom !== "" && dateTo !== "") {
    //   findQuery.createdAt = {
    //     $gte: dateFrom !== "" && new Date(dateFrom),
    //     $lte: dateTo !== "" && new Date(dateTo),
    //   };
    // }

    const ids = [];

    const orders = await Order.find(findQuery).populate("salesPerson");

    if (orders.length > 0) {
      const orderIds = await Order.find(findQuery).select("_id");

      orderIds.forEach((e) => ids.push(e._id));

      await Order.updateMany(
        { _id: { $in: ids } },
        { $set: { isInvoiced: true } },
        { multi: true }
      );

      let subtotal = orders.reduce(function (accumulator, curValue) {
        return accumulator + curValue.price;
      }, 0);

      const invoiceObj = {
        shipping: user[0],
        items: orders,
        subtotal: subtotal,
        paid: 0,
        invoice_nr: invocieNumber,
      };

      createInvoice(invoiceObj, (resolve) => {
        resolve.then(async (data) => {
          const invoice = new Invoice({
            invoiceNumber: invocieNumber,
            orders: ids,
            customer,
            dateFrom,
            dateTo,
            totalAmount: subtotal,
            discountAmount: 0,
            netAmount: 0,
            paidAmount: 0,
            balanceAmount: subtotal,
            status: "Unpaid",
            invoiceUrl: fileUrl,
          });
          await invoice.save();
          let invoices = await Invoice.find({ customer: userId });
          orders?.foreach((order) =>
            Order.findByIdAndUpdate(
              { _id: order._id },
              {
                $set: {
                  isInvoiced: true,
                },
              }
            )
          );
          res.status(200).send({
            status: "Ok",
            message: "record created successfully",
            data: invoices,
          });
        });
      });
    } else {
      res.status(200).send({
        status: "Error",
        message: "No Orders Found!",
      });
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    let findQuery = {};
    let top = 10;
    let skip = 0;
    let populate = "orders";
    let sort = "";

    if (req.query.name) {
      let regex = new RegExp(req.query.name);
      findQuery.name = { $regex: regex };
    }
    if (req.query.populate) {
      populate = req.query.populate;
    }
    if (req.query.customer) {
      findQuery.customer = req.query.customer;
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
    let totalCount = await Invoice.countDocuments({ ...findQuery });
    const invoice = await Invoice.find({ ...findQuery })
      .populate(populate)
      .skip(skip)
      .limit(top)
      .sort(sort);

    res.status(200).send({
      status: "Ok",
      data: invoice,
      count: totalCount,
    });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById({ _id: id }).populate("orders");
    res.status(200).send({ status: "Ok", data: invoice });
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};
