const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");



const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const eventRoute = require("./routes/eventRoute");
const individualScoreRoute = require("./routes/individualScoreRoute");
const groupScoreRoute = require("./routes/groupScoreRoute");
const criteriaRoute = require("./routes/criteriaRoute");
const candidateRoute = require("./routes/candidateRoute");
const criteriaLevelRoute = require("./routes/criteriaLevelRoute");
const groupRoute = require("./routes/groupRoute");


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ]
  }
));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.json({ message: "Welcome to eTabulation System."});
});
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);
app.use("/api/individual-score", individualScoreRoute);
app.use("/api/group-score", groupScoreRoute);
app.use("/api/criteria", criteriaRoute);
app.use("/api/candidate",candidateRoute);
app.use("/api/criteria-level",criteriaLevelRoute);
app.use("/api/group",groupRoute);


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error });
});

module.exports = app;
