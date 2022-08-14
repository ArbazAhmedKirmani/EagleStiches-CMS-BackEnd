const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const mailerConfig = require("../utils/serviceVariables");
const nodemailer = require("nodemailer");

exports.decodeBase64Image = async function (image, req, res, fileName, cb) {
  try {
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches !== null) {
      if (fileName !== "") {
        fs.unlink(
          path.join(__dirname, "../../", "public") + "/" + fileName,
          (err) => {
            if (err) console.log(err);
            else {
              console.log("\nDeleted file: ", fileName);
            }
          }
        );
      }
      const decodeBase64Image = (dataString) => {
        const response = {};

        response.type = matches[1];
        response.data = new Buffer.from(matches[2], "base64");

        return response;
      };

      const imageTypeRegularExpression = /\/(.*?)$/;
      const seed = crypto.randomBytes(20);
      const uniqueSHA1String = crypto
        .createHash("sha1")
        .update(seed)
        .digest("hex");

      const imageBuffer = decodeBase64Image(image);

      const uniqueRandomImageName = "image-" + uniqueSHA1String;
      const imageTypeDetected = imageBuffer.type.match(
        imageTypeRegularExpression
      );

      let userUploadedImagePath =
        path.join(__dirname, "../../", "public") +
        "/" +
        uniqueRandomImageName +
        "." +
        imageTypeDetected[1];

      fs.writeFile(userUploadedImagePath, imageBuffer.data, function () {
        let fileUrl =
          req.protocol +
          "://" +
          req.get("host") +
          userUploadedImagePath
            .split(path.join(__dirname, "../../", "public"))
            .pop();
        cb(fileUrl);
      });
    } else {
      cb(image);
    }
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.SavedeleteOrUpdateFiles = async function (imgUrls, photos, req, res) {
  try {
    let removeImagesNames = [];

    const updatedPhotosUrls = photos.filter((o) => {
      if (imgUrls.indexOf(o) === -1) {
        const fileName = o.split("/")[3];
        removeImagesNames.push(fileName);
      } else {
        return o;
      }
    });

    removeImagesNames.map((name) => {
      fs.unlink(
        path.join(__dirname, "../../", "public") + "/" + name,
        (err) => {
          if (err) console.log(err);
          else {
            console.log("\nDeleted file: ", name);
          }
        }
      );
    });

    return updatedPhotosUrls;
  } catch (err) {
    console.log("Error :", err);
    res.status(400).send({ status: "Error", message: "check server logs" });
  }
};

exports.sendEmail = async function (to, subject, emailBody) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailerConfig.email, // generated ethereal user
        pass: mailerConfig.password, // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: "Eagle Stiches", // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: emailBody, // html body
    });
  } catch (err) {
    console.log("Error :", err);
  }
};
