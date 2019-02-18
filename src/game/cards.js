import Bandit from '../cards/bandit';
import Bureaucrat from '../cards/bureaucrat';
import Cellar from '../cards/cellar';
import Chapel from '../cards/chapel';
import CouncilRoom from '../cards/councilRoom';
import Curse from '../cards/curse';
import Copper from '../cards/copper';
import Festival from '../cards/festival';
import Gardens from '../cards/gardens';
import Harbinger from '../cards/harbinger';
import Laboratory from '../cards/laboratory';
import Library from '../cards/library';
import Market from '../cards/market';
import Militia from '../cards/militia';
import Moat from '../cards/moat';
import Moneylender from '../cards/moneylender';
import Poacher from '../cards/poacher';
import Remodel from '../cards/remodel';
import Silver from '../cards/silver';
import Gold from '../cards/gold';
import Estate from '../cards/estate';
import Duchy from '../cards/duchy';
import Province from '../cards/province';
import Smithy from '../cards/smithy';
import ThroneRoom from '../cards/throneRoom';
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
  Bandit: new Bandit(),
  Bureaucrat: new Bureaucrat(),
  Cellar: new Cellar(),
  Chapel: new Chapel(),
  'Council Room': new CouncilRoom(),
  Festival: new Festival(),
  Gardens: new Gardens(),
  Harbinger: new Harbinger(),
  Laboratory: new Laboratory(),
  Library: new Library(),
  Market: new Market(),
  Militia: new Militia(),
  Moat: new Moat(),
  Moneylender: new Moneylender(),
  Poacher: new Poacher(),
  Remodel: new Remodel(),
  Smithy: new Smithy(),
  'Throne Room': new ThroneRoom(),
  Vassal: new Vassal(),
  Village: new Village(),
  Witch: new Witch(),
  Workshop: new Workshop(),

  // Placeholder for later
  Crossroads: { toString: () => 'Crossroads' },
  Lookout: { toString: () => 'Lookout' },
  Menagerie: { toString: () => 'Menagerie' },
  ShantyTown: { toString: () => 'Shanty Town' },
  Tournament: { toString: () => 'Tournament' },
  KingsCourt: { toString: () => 'King\'s Court', isAction: () => true },
  Conspirator: { toString: () => 'Conspirator' },
  GreatHall: { toString: () => 'Great Hall' },
  Oracle: { toString: () => 'Oracle', isAction: () => true },
  TreasureMap: { toString: () => 'Treasure Map' },
  Explorer: { toString: () => 'Explorer' },
  Coppersmith: { toString: () => 'Coppersmith' },
  Baron: { toString: () => 'Baron' },
  Watchtower: { toString: () => 'Watchtower' }
};

export default cards;
