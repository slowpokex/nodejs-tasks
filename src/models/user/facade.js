import Facade from '../../bin/facade';
import userSchema from './schema';

class UserFacade extends Facade {}

export default new UserFacade(userSchema);
