export default (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  product.associate = (models) => {
    product.belongsToMany(models.order, { through: 'product_order', as: 'order' });
    product.hasMany(models.review);
  };

  return product;
};
