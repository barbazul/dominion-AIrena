import Artisan from '../cards/artisan.js';
import Bandit from '../cards/bandit.js';
import Bureaucrat from '../cards/bureaucrat.js';
import Cellar from '../cards/cellar.js';
import Chapel from '../cards/chapel.js';
import CouncilRoom from '../cards/councilRoom.js';
import Curse from '../cards/curse.js';
import Copper from '../cards/copper.js';
import Festival from '../cards/festival.js';
import Gardens from '../cards/gardens.js';
import Harbinger from '../cards/harbinger.js';
import Laboratory from '../cards/laboratory.js';
import Library from '../cards/library.js';
import Market from '../cards/market.js';
import Merchant from '../cards/merchant.js';
import Militia from '../cards/militia.js';
import Mine from '../cards/mine.js';
import Moat from '../cards/moat.js';
import Moneylender from '../cards/moneylender.js';
import Poacher from '../cards/poacher.js';
import Remodel from '../cards/remodel.js';
import Sentry from '../cards/sentry.js';
import Silver from '../cards/silver.js';
import Gold from '../cards/gold.js';
import Estate from '../cards/estate.js';
import Duchy from '../cards/duchy.js';
import Province from '../cards/province.js';
import Smithy from '../cards/smithy.js';
import ThroneRoom from '../cards/throneRoom.js';
import Vassal from '../cards/vassal.js';
import Village from '../cards/village.js';
import Witch from '../cards/witch.js';
import Workshop from '../cards/workshop.js';
import Bridge from '../cards/bridge.js';

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
  Artisan: new Artisan(),
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
  Merchant: new Merchant(),
  Militia: new Militia(),
  Mine: new Mine(),
  Moat: new Moat(),
  Moneylender: new Moneylender(),
  Poacher: new Poacher(),
  Remodel: new Remodel(),
  Sentry: new Sentry(),
  Smithy: new Smithy(),
  'Throne Room': new ThroneRoom(),
  Vassal: new Vassal(),
  Village: new Village(),
  Witch: new Witch(),
  Workshop: new Workshop(),

  // Intrigue
  Bridge: new Bridge()
};

export default cards;
