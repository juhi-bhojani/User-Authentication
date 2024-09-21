const express = require("express");
const { db, check } = require("./src/models/database");
const logger = require("./src/middleware/log");
const userRouter = require("./src/routes/userRouter");

const app = express();

app.use(express.json());

app.use(logger);

app.use(userRouter);

app.get("/", (req, res) => {
  res.send("User authentication");
});

app.listen(3000, () => {
  console.log("server is up and running");
  check();
});
