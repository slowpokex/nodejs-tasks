export default class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  create(req, res, next) {
    this.facade.create(req.body)
      .then(doc => res.status(201).json(doc))
      .catch(err => next(err));
  }

  find(req, res, next) {
    this.facade.find(req.query)
      .then(collection => res.status(200).json(collection))
      .catch(err => next(err));
  }

  findOne(req, res, next) {
    this.facade.findOne(req.query)
      .then(doc => res.status(200).json(doc))
      .catch(err => next(err));
  }

  findById(req, res, next) {
    this.facade.findById(req.params.id)
      .then((doc) => {
        if (!doc) res.sendStatus(404);
        res.status(200).json(doc);
      })
      .catch(err => next(err));
  }

  update(req, res, next) {
    this.facade.update({ _id: req.params.id }, req.body)
      .then((results) => {
        if (results.n < 1) {
          res.sendStatus(404);
        }
        if (results.nModified < 1) {
          res.sendStatus(304);
        }
        res.sendStatus(200);
      })
      .catch(err => next(err));
  }

  remove(req, res, next) {
    this.facade.remove({ _id: req.params.id })
      .then((doc) => {
        if (!doc) res.sendStatus(404);
        res.status(204).json(doc);
      })
      .catch(err => next(err));
  }
}
