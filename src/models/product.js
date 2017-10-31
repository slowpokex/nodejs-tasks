import lodash from 'lodash';

export default class Product {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  set reviews(reviews) {
    if (!lodash.isArray(reviews)) {
      throw new TypeError('Reviews should be an array!');
    }
    this.reviews = reviews;
  }
}
