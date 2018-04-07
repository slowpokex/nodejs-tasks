import httpStatus from 'http-status';
import Controller from '../../bin/controller';
import userFacade from './facade';

class UserController extends Controller {
    async findUser(req, res, next) {
        try {
            const { user: login } = req.params;
            return res
                .status(httpStatus.OK)
                .json(await this.facade.findOne({ login }));
        } catch (err) {
            return next(err);
        }
    }
}

export default new UserController(userFacade);
