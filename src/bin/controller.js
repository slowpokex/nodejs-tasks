import httpStatus from 'http-status';

export default class Controller {
  constructor(facade) {
    this.facade = facade;
  }

  async create(req, res, next) {
    try {
      return res
        .status(httpStatus.CREATED)
        .json(await this.facade.create(req.body));
    } catch (err) {
      return next(err);
    }
  }

  async find(req, res, next) {
    try {
      return res
        .status(httpStatus.OK)
        .json(await this.facade.find(req.query));
    } catch (err) {
      return next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      return res
        .status(httpStatus.OK)
        .json(await this.facade.findOne(req.query));
    } catch (err) {
      return next(err);
    }
  }

  async findById(req, res, next) {
    try {
      const data = await this.facade.findById(req.params.id);
      if (!data) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res
        .status(httpStatus.OK)
        .json(data);
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const results = await this.facade.update({
        _id: req.params.id,
      }, req.body);
      if (results.n < 1) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      if (results.nModified < 1) {
        return res.sendStatus(httpStatus.NOT_MODIFIED);
      }
      const data = await this.facade.findById(req.params.id);
      if (!data) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.status(httpStatus.OK).json(data);
    } catch (err) {
      return next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const data = await this.facade.remove({
        _id: req.params.id,
      });
      if (!data) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (err) {
      return next(err);
    }
  }
}
