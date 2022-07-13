const http = require("http");
const app = require("./app");
const server = http.createServer(app);
require("./config/database/db"); //import the database

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@etabulation.rylouqi.mongodb.net/?retryWrites=true&w=majority`);
}
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

