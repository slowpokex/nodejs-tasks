import lodash from 'lodash';

const generateId = () => lodash.random(Number.MAX_SAFE_INTEGER);

export default class Facade {
  constructor(Schema) {
    this.Schema = Schema;
  }

  /**
   * Create new schema from body
   * @param {*} body - object
   * @returns {Promise}
   */
  create(body) {
    const schema = new this.Schema({
      _id: generateId(),
      ...lodash.omit(body, '_id'),
    });
    return schema.save();
  }

  /**
   * Create new schema from data if entity doesn't exist
   * @param {*} data - object
   * @returns {Promise}
   */
  createIfEmpty(data) {
    return this.find({})
      .then(result => (lodash.isEmpty(result) ? this.insertMany(data) : null));
  }

  insertMany(bodies) {
    return Promise.all(lodash.map(bodies, body => this.create(body)));
  }

  /**
   * Count schema instances
   * @param {*} args
   */
  count(...args) {
    return this.Schema
      .find(...args)
      .count()
      .exec();
  }

  /**
   * Find instances
   * @param {*} args
   * @returns {Promise}
   */
  find(...args) {
    return this.Schema
      .find(...args)
      .exec();
  }

  /**
   * Find one instance
   * @param {*} args
   * @returns {Promise}
   */
  findOne(...args) {
    return this.Schema
      .findOne(...args)
      .exec();
  }

  /**
   * Find by unique ID
   * @param {*} args
   * @returns {Promise}
   */
  findById(...args) {
    return this.Schema
      .findById(...args)
      .exec();
  }

  /**
   * Update instances
   * @param {*} args
   * @returns {Promise}
   */
  update(...args) {
    return this.Schema
      .update(...args)
      .exec();
  }

  /**
   * Remove instances
   * @param {*} args
   * @returns {Promise}
   */
  remove(...args) {
    return this.Schema
      .remove(...args)
      .exec();
  }
}
