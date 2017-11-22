export default (sequelize, DataTypes) =>
  sequelize.define('product_order', {
    orderId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  });
