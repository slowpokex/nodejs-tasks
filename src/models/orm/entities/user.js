export default (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    login: {
      type: DataTypes.STRING,
      unique: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  user.associate = (models) => {
    user.hasMany(models.order);
  };
  return user;
};
