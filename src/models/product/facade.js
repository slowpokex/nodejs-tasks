import Facade from '../../bin/facade';
import productSchema from './schema';
import productMockData from '../../data/products';

class ProductFacade extends Facade {
  create(body) {
    const schema = new this.Schema(body);
    return schema.save();
  }

  find(...args) {
    return this.Schema
      .find(...args)
      .populate('reviews')
      .exec();
  }

  update(...args) {
    return this.Schema
      .update(...args)
      .populate('reviews')
      .exec();
  }

  findOne(...args) {
    return this.Schema
      .findOne(...args)
      .populate('reviews')
      .exec();
  }

  findById(...args) {
    return this.Schema
      .findById(...args)
      .populate('reviews')
      .exec();
  }

  remove(...args) {
    return this.Schema
      .remove(...args)
      .populate('reviews')
      .exec();
  }
}

const productFacade = new ProductFacade(productSchema);
productFacade
  .createIfEmpty(productMockData)
  .catch(console.error);

export default productFacade;
