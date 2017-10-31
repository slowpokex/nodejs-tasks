import Facade from '../../bin/facade';
import productSchema from './schema';

class ProductFacade extends Facade {}

export default new ProductFacade(productSchema);
