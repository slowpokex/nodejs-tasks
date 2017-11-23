import Controller from '../../../bin/controller';
import userFacade from '../facades/product';

class ProductController extends Controller {
  all(req, res, next) {
    this.facade.all()
      .then(values => res.status(200).json(values))
      .catch(err => next(err));
  }

  getReviewsById(req, res, next) {
    this.facade.getReviewsById(req.params.id)
      .then(values => res.status(200).json(values))
      .catch(err => next(err));
  }
}

export default new ProductController(userFacade);
