import Facade from '../../../bin/facade';
import db from '../../index';

class UserFacade extends Facade {
  constructor(mainSchema, additionalSchema) {
    super(mainSchema);
    this.addSchema = additionalSchema;
  }

  all() {
    return this.Schema.all();
  }

  findById(...args) {
    return this.Schema.findById(...args);
  }

  getReviewsById(id) {
    return this.addSchema.findAll({ where: { productId: id } });
  }
}

export default new UserFacade(db.product, db.review);
