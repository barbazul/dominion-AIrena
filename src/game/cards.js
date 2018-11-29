import Curse from '../cards/curse';
import Copper from '../cards/copper';
import Silver from '../cards/silver';
import Gold from '../cards/gold';
import Estate from '../cards/estate';
import Duchy from '../cards/duchy';
import Province from '../cards/province';
import Village from '../cards/village';

const cards = {
  // Basic cards
  Copper: new Copper(),
  Silver: new Silver(),
  Gold: new Gold(),
  Curse: new Curse(),
  Estate: new Estate(),
  Duchy: new Duchy(),
  Province: new Province(),

  // Base set cards
  Village: new Village()
};

export default cards;
