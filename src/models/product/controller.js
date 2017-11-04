import Controller from '../../bin/controller';
import productFacade from './facade';
import reviewFacade from '../review/facade';

class ProductController extends Controller {
  constructor(mainFacade, addFacade) {
    super(mainFacade);
    this.addFacade = addFacade;
  }

  create(req, res, next) {
    this.facade.create(req.body)
      .then(result => this.facade.find(result))
      .then(doc => res.status(201).json(doc))
      .catch(err => next(err));
  }

  getAllProducts(req, res, next) {
    this.facade.findById(req.params.id)
      .then(value =>
        Promise.all(value.reviews.map((item => this.addFacade.findById(item)))))
      .then((doc) => {
        if (!doc) res.sendStatus(404);
        res.status(200).json(doc);
      })
      .catch(err => next(err));
  }
}

export default new ProductController(productFacade, reviewFacade);
