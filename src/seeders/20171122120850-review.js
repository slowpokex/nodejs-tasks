export default {
  up: queryInterface => queryInterface.bulkInsert('reviews',
    [
      {
        id: 1,
        productId: 1,
        head: 'Need to buy',
        summary: 'YAAAAAAAAAAAA!',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 2,
        productId: 1,
        head: 'Good purchase',
        summary: '+++',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 3,
        productId: 2,
        head: 'It need for life',
        summary: 'Coooool!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface.bulkDelete('reviews', null, {}),
};
