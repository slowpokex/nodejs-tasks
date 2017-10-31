import Facade from '../../bin/facade';
import reviewSchema from './schema';

class ReviewFacade extends Facade {}

export default new ReviewFacade(reviewSchema);
