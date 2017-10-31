import lodash from 'lodash';

export default class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  set products(products) {
    if (!lodash.isArray(products)) {
      throw new TypeError('Products should be an array!');
    }
    this.products = products;
  }
}
