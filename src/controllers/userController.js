const {
  addUser,
  findUserByEmailOrPhone,
  findUserByUserName,
  loginUser,
} = require("../services/userService");
const logger = require("../utils/logger");

module.exports.createuser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      username,
      roleId,
    } = req.body;

    // validate user body
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !password ||
      !username
    ) {
      return res.status(400).json({
        status: "Failure",
        message: "Missing Required Fields!",
      });
    }

    // check if email or phone number is already in use
    const existingUser = await findUserByEmailOrPhone(email, phoneNumber);
    if (existingUser.length >= 1) {
      return res.status(400).json({
        status: "Failure",
        message: "User with this phone or email already exists",
      });
    }

    // checking if username is in use
    const existingUsername = await findUserByUserName(username);
    if (existingUsername.length >= 1) {
      return res.status(400).json({
        status: "Failure",
        message:
          "Sorry, this username is already taken, please try another username!",
      });
    }

    // creating new user
    const newUser = await addUser(
      {
        firstName,
        lastName,
        phoneNumber,
        password,
        username,
        email,
      },
      roleId || 1
    );
    res.status(200).json({
      status: "success",
      data: {
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    logger.error({
      incoming_request: req.url,
      method: req.method,
      error: error.message || "Error occured at user controller to create user",
    });
    res.status(500).json({
      status: "Failure",
      message: error.message || "Sorry, Internal server error!",
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { userDetails, accessToken, refreshToken } = await loginUser({
      username,
      password,
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict", // prevents CSRF attacks
      maxAge: 60 * 60 * 1000, // 60 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict", // prevents CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      status: "Success",
      message: "User Logged in successfully",
      data: {
        user: {
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          username: userDetails.username,
        },
      },
    });
  } catch (error) {
    logger.error({
      incoming_request: req.url,
      method: req.method,
      error: error.message || "Error occured at user controller to login user",
    });
    res.status(500).json({
      status: "Failure",
      message: error.message || "Sorry, Internal server error!",
    });
  }
};
