import getUpdateYear from './stateUpdateYear';
import getUpdateView from './stateUpdateView';
import getUpdateTextSearch from './stateUpdateTextSearch';
import getUpdateLanguage from './stateUpdateLanguage';
import getStateUpdateCurrentLocation from './stateUpdateCurrentLocation';
import getUpdateClickSearch from './stateUpdateClickSearch';
import getAreaSearch from './stateUpdateAreaSearch';
import getUpdateHighlightedLayer from './stateUpdateHighlightedLayer';
import getUpdateAllRasterOpen from './stateUpdateAllRasterOpen';
import getUpdateTransitionsDisabled from './stateUpdateTransitionsDisabled';
import getUpdateScreenSize from './stateUpdateScreenSize';
import getUpdateSidebarOpen from './stateUpdateSidebarOpen';
import getUpdateFooterOpen from './stateUpdateFooterOpen';
import getUpdateCurrentLayers from './stateUpdateCurrentLayers';
import getUpdateAreaSearchActive from './stateUpdateAreaSearchActive';
import getUpdateHighlightedFeature from './stateUpdateHighlightedFeature';
import getUpdateCurrentOverlay from './stateUpdateCurrentOverlay';
import getUpdateCurrentView from './stateUpdateCurrentView';
import getUpdateCurrentRasterProbe from './stateUpdateCurrentRasterProbe';
import getUpdateFooterView from './stateUpdateFooterView';
import getUpdateMouseEventsDisabled from './stateUpdateMouseEventsDisabled';
import getUpdateMapLoaded from './stateUpdateMapLoaded';
import getUpdateOverlayOpacity from './stateUpdateOverlayOpacity';
import getUpdateRegisterOpen from './stateUpdateRegisterOpen';

const setStateEvents = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    highlightedLayer: getUpdateHighlightedLayer({ components }),
    year: getUpdateYear({ data, components }),
    view: getUpdateView({ components }),
    language: getUpdateLanguage({ data, components }),
    currentLocation: getStateUpdateCurrentLocation({ components }),
    textSearch: getUpdateTextSearch({ components }),
    clickSearch: getUpdateClickSearch({ components }),
    transitionsDisabled: getUpdateTransitionsDisabled({ components }),
    screenSize: getUpdateScreenSize({ components }),
    sidebarOpen: getUpdateSidebarOpen({ components }),
    footerOpen: getUpdateFooterOpen({ components }),
    currentLayers: getUpdateCurrentLayers({ components }),
    areaSearch: getAreaSearch({ components }),
    areaSearchActive: getUpdateAreaSearchActive({ components }),
    highlightedFeature: getUpdateHighlightedFeature({ components }),
    currentOverlay: getUpdateCurrentOverlay({ components }),
    currentView: getUpdateCurrentView({ components }),
    currentRasterProbe: getUpdateCurrentRasterProbe({ components }),
    footerView: getUpdateFooterView({ components, data }),
    allRasterOpen: getUpdateAllRasterOpen({ components }),
    mouseEventsDisabled: getUpdateMouseEventsDisabled({ components }),
    mapLoaded: getUpdateMapLoaded({ components }),
    overlayOpacity: getUpdateOverlayOpacity({ components }),
    registerOpen: getUpdateRegisterOpen({ components }),
  });
};

export default setStateEvents;
