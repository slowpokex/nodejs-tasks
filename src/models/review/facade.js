import Facade from '../../bin/facade';
import reviewSchema from './schema';

class ReviewFacade extends Facade {}

const reviewFacade = new ReviewFacade(reviewSchema);

export default reviewFacade;
