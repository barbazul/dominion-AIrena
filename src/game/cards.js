import Bureaucrat from '../cards/bureaucrat';
import Cellar from '../cards/cellar';
import Chapel from '../cards/chapel';
import Curse from '../cards/curse';
import Copper from '../cards/copper';
import Harbinger from '../cards/harbinger';
import Moat from '../cards/moat';
import Moneylender from '../cards/moneylender';
import Silver from '../cards/silver';
import Gold from '../cards/gold';
import Estate from '../cards/estate';
import Duchy from '../cards/duchy';
import Province from '../cards/province';
import Vassal from '../cards/vassal';
import Village from '../cards/village';
import Witch from '../cards/witch';
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
  Bureaucrat: new Bureaucrat(),
  Cellar: new Cellar(),
  Chapel: new Chapel(),
  Moat: new Moat(),
  Harbinger: new Harbinger(),
  Moneylender: new Moneylender(),
  Vassal: new Vassal(),
  Village: new Village(),
  Witch: new Witch(),
  Workshop: new Workshop()
};

export default cards;
