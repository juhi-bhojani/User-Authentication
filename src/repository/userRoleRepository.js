const { Op } = require("sequelize");
const { db } = require("../models/database");
const { UserRole } = db;
const logger = require("../utils/logger");

module.exports.addUserRole = async (userId, roleId) => {
  try {
    const userRole = await UserRole.create({
      user_id: userId,
      role_id: roleId,
    });
    logger.info({
      operation: "database insertion",
      data: {
        userRole: userRole,
      },
    });
    return userRole;
  } catch (error) {
    throw new Error("Unable to identify user");
  }
};

module.exports.getUserRole = async (userId) => {
  try {
    const userRole = await UserRole.findOne({
      where: {
        user_id: userId,
      },
    });
    logger.info({
      operation: "database selection",
      data: {
        userRole: userRole,
      },
    });
    return userRole;
  } catch (error) {
    throw new Error("Unable to identify user");
  }
};
