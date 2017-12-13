import lodash from 'lodash';

export default class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  create(body) {
    const schema = new this.Schema(body);
    return schema.save();
  }


  createIfEmpty(data) {
    return this.find({})
      .then(result => (lodash.isEmpty(result) ? this.insertMany(data) : null));
  }

  insertMany(bodies) {
    return Promise.all(lodash.map(bodies, body => this.create(body)));
  }

  find(...args) {
    return this.Schema
      .find(...args)
      .exec();
  }

  update(...args) {
    return this.Schema
      .update(...args)
      .exec();
  }

  findOne(...args) {
    return this.Schema
      .findOne(...args)
      .exec();
  }

  findById(...args) {
    return this.Schema
      .findById(...args)
      .exec();
  }

  remove(...args) {
    return this.Schema
      .remove(...args)
      .exec();
  }
}
