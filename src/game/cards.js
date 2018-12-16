import Cellar from '../cards/cellar';
import Chapel from '../cards/chapel';
import Curse from '../cards/curse';
import Copper from '../cards/copper';
import Harbinger from '../cards/harbinger';
import Moat from '../cards/moat';
import Silver from '../cards/silver';
import Gold from '../cards/gold';
import Estate from '../cards/estate';
import Duchy from '../cards/duchy';
import Province from '../cards/province';
import Vassal from '../cards/vassal';
import Village from '../cards/village';
import Workshop from '../cards/workshop';

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
  Cellar: new Cellar(),
  Chapel: new Chapel(),
  Moat: new Moat(),
  Harbinger: new Harbinger(),
  Vassal: new Vassal(),
  Village: new Village(),
  Workshop: new Workshop()
};

export default cards;
