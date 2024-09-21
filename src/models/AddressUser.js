module.exports = (sequelize, DataTypes) => {
  const AddressUser = sequelize.define(
    "AddressUser",
    {
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
      tableName: "address_user",
      timestamps: true,
    }
  );
  return AddressUser;
};
