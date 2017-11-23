import Facade from '../../../bin/facade';
import db from '../../index';

class UserFacade extends Facade {
  all() {
    return this.Schema.all();
  }
}

export default new UserFacade(db.user);
