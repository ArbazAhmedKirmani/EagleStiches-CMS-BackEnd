const app = require("./server/server");
const config = require("./server/config/development");

// Database
require("./db");

// Server Listening on config.port
app.listen(config.port, () => {
  console.log("[*]Listening on port:", config.port);
});
