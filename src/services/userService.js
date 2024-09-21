const {
  createUser,
  findUserByEmailOrPhone,
  findUserByUserName,
  findUser,
} = require("../repository/userRepository");
const {
  addUserRole,
  getUserRole,
} = require("../repository/userRoleRepository");
const validator = require("validator");

function validatePassword(password) {
  const minLength = /.{8,}/; // At least 8 characters
  const hasLowercase = /[a-z]/; // At least one lowercase letter
  const hasUppercase = /[A-Z]/; // At least one uppercase letter
  const hasDigit = /[0-9]/; // At least one digit
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  if (!minLength.test(password)) {
    return "Password must be at least 8 characters long.";
  }
  if (!hasLowercase.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasDigit.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!hasSpecialChar.test(password)) {
    return "Password must contain at least one special character.";
  }

  return true;
}

module.exports.addUser = async (userDetails, roleId) => {
  try {
    if (!validator.isEmail(userDetails.email)) {
      throw new Error("Please enter correct email address");
    }

    if (validatePassword(userDetails.password) !== true) {
      throw new Error(validatePassword(userDetails.password));
    }

    const newuser = await createUser(userDetails);
    console.log(newuser);

    const newUserRole = await addUserRole(newuser.id, roleId);
    return newuser;
  } catch (error) {
    throw new Error(error.message || "Unable to create new user at the moment");
  }
};

module.exports.findUserByEmailOrPhone = async (email, phone) => {
  try {
    const user = await findUserByEmailOrPhone(email, String(phone));
    return user;
  } catch (error) {
    // couldn't find user
    throw new Error(error.message || "Unable to get user details");
  }
};

module.exports.findUserByUserName = async (username) => {
  try {
    const user = await findUserByUserName(username);
    return user;
  } catch (error) {
    // couldn't find user
    throw new Error(error.message || "Unable to get user details");
  }
};

module.exports.loginUser = async (user) => {
  try {
    const userDetails = await findUser(user);

    if (!userDetails) {
      throw new Error("User doesn't exist, Please login!");
    }
    if (!(await userDetails.validatePassword(user.password))) {
      throw new Error("Incorrect username or password");
    }
    const userRole = await getUserRole(userDetails.id);
    const { accessToken, refreshToken } = await userDetails.generateAuthToken(
      userRole.role_id
    );
    return { userDetails, accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message || "Unable to login user");
  }
};
