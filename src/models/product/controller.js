import Controller from '../../bin/controller';
import productFacade from './facade';

class ProductController extends Controller {}

export default new ProductController(productFacade);
