/* eslint-disable */
export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users',
      [
        {
          id: 1,
          login: 'docker',
          password: 'docker',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          login: 'clever',
          password: 'clever',
          firstName: 'Mikita',
          lastName: 'Isakau',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          login: 'hello',
          password: 'world',
          firstName: 'Vlad',
          lastName: 'Kolotsey',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
