export default (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    head: DataTypes.STRING,
    summary: DataTypes.STRING,
  });

  review.associate = (models) => {
    review.belongsTo(models.product);
  };
  return review;
};
