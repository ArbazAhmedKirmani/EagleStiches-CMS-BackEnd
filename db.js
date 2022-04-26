const mongoose = require("mongoose");
const config = require("./server/config/development");
mongoose
  .connect(config.db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((status) => {
    console.log("[*]Connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });
