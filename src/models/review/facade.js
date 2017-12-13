import Facade from '../../bin/facade';
import reviewSchema from './schema';
import reviewMockData from '../../data/reviews';

class ReviewFacade extends Facade {}

const reviewFacade = new ReviewFacade(reviewSchema);

reviewFacade
  .createIfEmpty(reviewMockData)
  .catch(console.error);

export default reviewFacade;
