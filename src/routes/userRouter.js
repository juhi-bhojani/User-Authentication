const express = require("express");
const { createuser, loginUser } = require("../controllers/userController");

const Router = express.Router();

Router.route("/user").post(createuser);

Router.post("/login", loginUser);

module.exports = Router;
