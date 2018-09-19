export const eras = [
  {
    center: [-15.793936, -47.882797],
    dates: [1892, 1954],
    datesDisplay: [1892, 1955],
    id: '1892-1955',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1955, 1963],
    datesDisplay: [1955, 1965],
    id: '1955-1965',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1964, 1984],
    datesDisplay: [1964, 1985],
    id: '1964-1985',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1985, new Date().getFullYear()],
    datesDisplay: [1985, new Date().getFullYear()],
    id: '1985-2018',
    zoom: null,
  },
];

export const colors = {
  highlightColor: 'rgb(204, 204, 204)',
};


export const yearRange = d3.extent(eras
  .reduce((accumulator, value) => [...accumulator, ...value.dates], []));

export const footerCategoryIcons = {
  views: 'icon-camera',
  aerials: 'icon-flight',
  maps: 'icon-map-o',
  plans: 'icon-tsquare',
};

export const selections = {
  outerContainer: d3.select('.outer-container'),
  areaSearchButton: d3.select('.area-button'),
  probeButtonsContainer: d3.select('.probe-buttons-container'),
  overlayButtonContainer: d3.select('.overlay-button'),
  erasButtonContainer: d3.select('.header__eras-button'),
  erasButtonText: d3.select('.header__eras-button-text'),

  footerContainer: d3.select('.footer'),
  categoriesContainer: d3.select('.footer__categories'),
  imagesContainer: d3.select('.footer__images'),
  showAllContainer: d3.select('.footer__show-all'),
  footerToggleButton: d3.select('.footer__toggle-button'),
  footerToggleYearContainer: d3.select('.footer__toggle-year'),
  footerToggleRastersContainer: d3.select('.footer__toggle-rasters-container'),
  allRasterOuterContainer: d3.select('.allraster__outer'),
  allRasterInnerContainer: d3.select('.allraster__inner'),
  allRasterContentContainer: d3.select('.allraster__content'),

  mapContainer: d3.select('#map'),

  timelineContainer: d3.select('.timeline-container'),
  sliderContainer: d3.select('.timeline-slider-container'),
  stepperTextContainer: d3.select('.timeline-stepper__year'),
  stepperLeftButton: d3.select('.timeline-stepper__left'),
  stepperRightButton: d3.select('.timeline-stepper__right'),

  rasterProbeContainer: d3.select('.raster-probe'),
  rasterProbeInnerContainer: d3.select('.raster-probe__inner'),
  rasterProbeTitleContainer: d3.select('.raster-probe__title-text'),
  rasterProbeImageContainer: d3.select('.raster-probe__image'),
  rasterProbeOverlayControlContainer: d3.select('.raster-probe__overlay-controls'),
  rasterProbeCloseButton: d3.select('.raster-probe__close-button'),
  rasterProbeControlsContainer: d3.select('.raster-probe__overlay-controls'),
  rasterProbeCloseOverlayButton: d3.select('.raster-probe__remove-overlay'),
  rasterProbeCreditsContainer: d3.select('.raster-probe__credits'),
  lightboxOuterContainer: d3.select('.lightbox__outer'),
  lightboxContentContainer: d3.select('.lightbox__content'),
  lightboxImageContainer: d3.select('.lightbox__image'),
  lightboxCreditsContainer: d3.select('.lightbox__credits'),
  lightboxSharedShelfButton: d3.select('.lightbox__view-button'),
  lightboxCloseButton: d3.select('.lightbox__close-button'),

  sidebarContainer: d3.select('.sidebar'),
  sidebarContentContainer: d3.select('.sidebar__content'),
  sidebarToggleButton: d3.select('.sidebar__toggle-button'),
  sidebarToggleHelpContainer: d3.select('.sidebar__toggle-help-container'),
  searchReturnContainer: d3.select('.sidebar__search-return'),
  textSearchReturnButton: d3.select('.sidebar__text-search-return-icon'),
  searchInput: d3.select('.sidebar__input'),
  resultsContainer: d3.select('.sidebar__results'),
  rasterResultsContainer: d3.select('.sidebar__raster-results'),
  nonRasterResultsContainer: d3.select('.sidebar__nonraster-results'),

  introBeginButtonContainer: d3.select('.intro__begin-button'),
  introJumpButtonContainer: d3.select('.intro__jump-button'),

  erasMapButtonContainer: d3.select('.eras__map-button'),
  erasStepperLeftButton: d3.select('.eras__stepper-icon-left'),
  erasStepperRightButton: d3.select('.eras__stepper-icon-right'),
  erasTitleContainer: d3.select('.eras__title'),
  erasBackButton: d3.select('.eras__back-button-outer'),
};
