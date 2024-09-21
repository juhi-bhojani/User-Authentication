const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../", "../dev.env") });

const secretKey = process.env.SECRETKEY;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profileImage: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Users",
      timestamps: true,
    }
  );

  // Using beforeCreate and beforeUpdate hooks to hash the password
  User.addHook("beforeCreate", async (user) => {
    user.password = await bcrpyt.hash(user.password, 8);
  });

  User.addHook("beforeUpdate", async (user) => {
    if (user.changed("password")) {
      // Check if password has been changed
      user.password = await bcrpyt.hash(user.password, 8);
    }
  });

  User.prototype.validatePassword = async function (password) {
    // Compare the provided password with the stored hashed password
    return await bcrpyt.compare(password, this.password);
  };

  User.prototype.generateAuthToken = async function (role_id) {
    try {
      const user = this;
      // first argument is payload, second is secret
      const accessToken = jwt.sign(
        { id: user.id.toString(), role_id: role_id.toString() },
        secretKey,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        { id: user.id.toString(), role_id: role_id.toString() },
        secretKey,
        {
          expiresIn: "1 week",
        }
      );
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Unable to authenticate!");
    }
  };
  return User;
};
