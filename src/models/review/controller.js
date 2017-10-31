import Controller from '../../bin/controller';
import reviewFacade from './facade';

class ReviewController extends Controller {}

export default new ReviewController(reviewFacade);
