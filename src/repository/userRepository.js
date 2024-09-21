const { Op } = require("sequelize");
const { db } = require("../models/database");
const { User } = db;
const logger = require("../utils/logger");

module.exports.createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    const { firstName, lastName, username, email, id } = newUser;
    logger.info({
      operation: "database insertion",
      data: {
        user: newUser,
      },
    });
    return { firstName, lastName, username, email, id };
  } catch (error) {
    throw new Error(
      error.message || "Internal Server Error, please try again later"
    );
  }
};

module.exports.findUserByEmailOrPhone = async (email, phone) => {
  try {
    const user = await User.findAll({
      where: {
        [Op.or]: [{ phoneNumber: phone }, { email: email }],
      },
    });
    logger.info({
      operation: "database query",
      data: {
        user: user,
      },
    });
    return user;
  } catch (error) {
    throw new Error("Unable to fetch user currently, please try later");
  }
};

module.exports.findUserByUserName = async (username) => {
  try {
    const user = await User.findAll({
      where: {
        username: username,
      },
    });
    logger.info({
      operation: "database query",
      data: {
        user,
      },
    });
    return user;
  } catch (error) {
    // database error
    throw new Error("Unable to fetch user");
  }
};

module.exports.findUser = async (user) => {
  try {
    const userDetails = await User.findOne({
      where: { username: user.username },
      attributes: [
        "firstName",
        "password",
        "id",
        "lastName",
        "username",
        "email",
      ],
    });
    logger.info({
      operation: "database query",
      data: {
        user: userDetails,
      },
    });
    return userDetails;
  } catch (error) {
    throw new Error("Unable to fetch user");
  }
};
