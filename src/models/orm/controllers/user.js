import Controller from '../../../bin/controller';
import userFacade from '../facades/user';

class UserController extends Controller {
  all(req, res, next) {
    this.facade.all()
      .then(values => res.status(200).json(values))
      .catch(err => next(err));
  }
}

export default new UserController(userFacade);
