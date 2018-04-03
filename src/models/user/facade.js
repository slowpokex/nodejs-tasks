import Facade from '../../bin/facade';
import userSchema from './schema';

class UserFacade extends Facade {
  find(...args) {
    return this.Schema
      .find(...args)
      .populate('products')
      .exec();
  }
}

const userFacade = new UserFacade(userSchema);
export default userFacade;
