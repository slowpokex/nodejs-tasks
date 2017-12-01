import Facade from '../../bin/facade';
import cityMockData from '../../data/cities';
import citySchema from './schema';

class CityFacade extends Facade {}

const cityFacade = new CityFacade(citySchema);

// Mock data if not exists
cityFacade
  .createIfEmpty(cityMockData)
  .catch(console.error);

export default cityFacade;
