export default {
  up: queryInterface => queryInterface.bulkInsert('orders',
    [
      {
        id: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),

  down: queryInterface => queryInterface.bulkDelete('orders', null, {}),
};
