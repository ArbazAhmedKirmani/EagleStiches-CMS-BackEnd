const express = require("express");
const api = require("./api/api");
const app = express();
const auth = require("./auth/routes");
require("./middleware/appMiddleware")(app);

app.use(express.static("public"));

app.use("/api", api);

app.use("/auth", auth);

app.all("*", (req, res, next) => {
  const err = new Error(`Requested URL ${req.path} not found!`);
  err.statusCode = 404;
  next(err);
});

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 401;
//   res.status(statusCode).json({
//     Error: "Unauthorized",
//   });
// });

module.exports = app;
