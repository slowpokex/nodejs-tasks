export default {
  up: queryInterface => queryInterface.bulkInsert('product_orders',
    [
      {
        id: 1,
        orderId: 2,
        productId: 3,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        orderId: 3,
        productId: 2,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        orderId: 1,
        productId: 1,
        quantity: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface.bulkDelete('product_orders', null, {}),
};
