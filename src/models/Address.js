module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      houseFlatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lane1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lane2: {
        type: DataTypes.STRING,
      },
      landmark: {
        type: DataTypes.STRING,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "addresses",
      timestamps: true,
    }
  );
  return Address;
};
