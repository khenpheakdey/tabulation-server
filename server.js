const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require("./config/database/db"); //import the database

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

