const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

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

exports.SavedeleteOrUpdateImages = async function (imgUrls, photos, req, res) {
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
            console.log("\nDeleted file: ", fileName);
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
