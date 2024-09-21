// password ot env variables

const { Sequelize, DataTypes } = require("sequelize");

const database = "zomato";
const user = "postgres";
const password = "password";

// ==== TO CONNECT TO LOCAL DATABASE ====
const sequelize = new Sequelize(database, user, password, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, DataTypes);
db.Role = require("./role.js")(sequelize, DataTypes);
db.UserRole = require("./UserRole.js")(sequelize, DataTypes);
db.Address = require("./Address.js")(sequelize, DataTypes);
db.AddressUser = require("./AddressUser.js")(sequelize, DataTypes);

// Define associations
db.User.belongsToMany(db.Role, {
  through: db.UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
});
db.Role.belongsToMany(db.User, {
  through: db.UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
});

db.User.belongsToMany(db.Address, { through: db.AddressUser });
db.Address.belongsToMany(db.User, { through: db.AddressUser });

const check = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // if migrations wasn't used then this line needs to be uncommented
    // await db.sequelize.sync({ alter: true, force: false });
    // console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = { db, check };
