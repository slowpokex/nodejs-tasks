import Facade from '../../bin/facade';
import userSchema from './schema';
import userMockData from '../../data/users';

class UserFacade extends Facade {
  find(...args) {
    return this.Schema
      .find(...args)
      .populate('products')
      .exec();
  }
}

const userFacade = new UserFacade(userSchema);

// Mock data if not exists
userFacade
  .createIfEmpty(userMockData)
  .catch(console.error);

export default userFacade;
