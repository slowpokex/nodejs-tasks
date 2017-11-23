export default {
  up: queryInterface => queryInterface.bulkInsert('products',
    [
      {
        id: 1,
        name: 'Broad',
        description: 'Good broad!',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 2,
        name: 'Butter',
        description: 'Delicious butter!',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        id: 3,
        name: 'Meat',
        description: 'Fresh meat!)',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {}),
  down: queryInterface => queryInterface.bulkDelete('products', null, {}),
};
