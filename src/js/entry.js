import getDispatch from './events';
import getInit from './init';
import getMap from './map';
import eras from './eras';
import getTimeline from './timeline';
import getFilmstrip from './filmstrip';
import getLegend from './legend';
import getSearch from './search';

const components = {};

components.eras = eras;
components.dispatch = getDispatch(components);
components.Map = getMap(components);
components.Timeline = getTimeline(components);
components.Filmstrip = getFilmstrip(components);
components.Legend = getLegend(components);
components.Search = getSearch(components);
components.init = getInit(components);

console.log('components', components);