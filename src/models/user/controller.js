import Controller from '../../bin/controller';
import userFacade from './facade';

class UserController extends Controller {}

export default new UserController(userFacade);
