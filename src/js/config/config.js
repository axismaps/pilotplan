/**
 * Module comprises assorted contants used in several modules
 * @module config
 */

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

export const tilesets = {
  dev: 'mapbox://axismaps.01c7rsvl',
  prod: 'mapbox://axismaps.dd66zwg7',
};

export const hillshades = {
  dev: 'mapbox://axismaps.pilothillshadedev',
  prod: 'mapbox://axismaps.pilothillshade',
};

export const selections = {
  outerContainer: d3.select('.outer-container'),
  areaSearchButton: d3.select('.area-button'),
  areaSearchText: d3.select('.area-button-text'),
  probeButtonsContainer: d3.select('.probe-buttons-container'),
  overlayButtonContainer: d3.select('.overlay-button'),
  hintProbeContainer: d3.select('.hint-probe__outer'),
  hintProbeContainerMobile: d3.select('.hint-probe__mobile'),
  hintProbeText: d3.select('.hint-probe'),
  erasButtonContainer: d3.select('.header__eras-button'),
  erasButtonText: d3.select('.header__eras-button-text'),
  erasMapButtonText: d3.select('.eras__map-button-text'),
  headerRegisterButton: d3.select('.header__register-button'),
  headerRegisterButtonText: d3.select('.header__register-button-text'),
  headerFacebookButton: d3.select('.header__facebook'),
  headerTwitterButton: d3.select('.header__twitter'),
  headerDownloadButton: d3.select('.header__download'),
  headerInfoButton: d3.select('.header__info'),

  loadingScreenContainer: d3.select('.loading__outer'),

  footerContainer: d3.select('.footer'),
  categoriesContainer: d3.select('.footer__categories'),
  footerCategoriesMobile: d3.select('.mobileFooter__categories'),
  imagesContainer: d3.select('.footer__images'),
  footerShowAllContainer: d3.select('.footer__show-all'),
  footerShowAllCircle: d3.select('.footer__show-all-circle'),
  footerToggleButton: d3.select('.footer__toggle-button'),
  footerToggleButtonMobile: d3.select('.mobileFooter__toggle'),
  footerToggleText: d3.select('.footer__toggle-text'),
  footerToggleTextContainer: d3.select('.footer__toggle-text-container'),
  footerToggleYearContainer: d3.select('.footer__toggle-year'),
  footerToggleRastersContainer: d3.select('.footer__toggle-rasters-container'),
  allRasterOuterContainer: d3.select('.allraster__outer'),
  allRasterInnerContainer: d3.select('.allraster__inner'),
  allRasterContentContainer: d3.select('.allraster__content'),
  allRasterCloseButton: d3.select('.allraster__close-button'),

  dataProbeMobileContainer: d3.select('.mobile-probe__outer'),
  dataProbeMobileCloseButton: d3.select('.mobile-probe__close-button'),
  dataProbeMobileTitle: d3.select('.mobile-probe__title'),
  dataProbeMobileContent: d3.select('.mobile-probe__content'),

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
  rasterProbeSliderContainer: d3.select('.raster-probe__overlay-slider'),

  registerOuterContainer: d3.select('.register__outer'),
  registerInnerContainer: d3.select('.register__inner'),
  registerImageContainer: d3.select('.register__image'),
  registerCancelButton: d3.select('.register__cancel-button'),
  registerSubmitButton: d3.select('.register__subscribe-button'),

  lightboxOuterContainer: d3.select('.lightbox__outer'),
  lightboxContentContainer: d3.select('.lightbox__content'),
  lightboxImageContainer: d3.select('.lightbox__image'),
  lightboxCreditsContainer: d3.select('.lightbox__credits'),
  lightboxSharedShelfButton: d3.select('.lightbox__view-button'),
  lightboxCloseButton: d3.select('.lightbox__close-button'),

  sidebarContainer: d3.select('.sidebar'),
  sidebarContentContainer: d3.select('.sidebar__inner-content'),
  sidebarToggleButton: d3.select('.sidebar__toggle-button'),
  sidebarToggleButtonMobile: d3.select('.header__legend-button'),
  sidebarToggleButtonText: d3.select('.sidebar__toggle-button-text'),
  sidebarToggleHelpContainer: d3.select('.sidebar__toggle-help-container'),
  sidebarViewshedLayerBlock: d3.select('.sidebar__viewsheds'),
  sidebarViewshedLayerRow: d3.select('.sidebar__layer-title-row'),
  sidebarViewshedLayerIconContainer: d3.select('.sidebar__viewsheds-icon'),
  searchReturnContainer: d3.select('.sidebar__search-return'),
  textSearchReturnButton: d3.select('.sidebar__text-search-return-icon'),
  textSearchReturnButtonMobile: d3.select('.sidebar__text-search-return-icon-mobile'),
  searchInput: d3.select('.sidebar__input'),
  resultsContainer: d3.select('.sidebar__results'),
  rasterResultsContainer: d3.select('.sidebar__raster-results'),
  nonRasterResultsContainer: d3.select('.sidebar__nonraster-results'),
  sidebarCloseButtonMobile: d3.select('.sidebar__close-button'),

  introBeginButtonContainer: d3.select('.intro__begin-button'),
  introBeginButtonText: d3.select('.intro__begin-button-text'),
  introJumpButtonText: d3.select('.intro__jump-button-text'),
  introJumpButtonContainer: d3.select('.intro__jump-button'),
  introJumpDropdownContainer: d3.select('.intro__jump-dropdown'),
  introJumpDropdownContent: d3.select('.intro__jump-dropdown-content'),
  introLanguageButtonContainer: d3.select('.intro__language-button-outer'),
  introLanguageButtonText: d3.select('.intro__language-button-text'),
  introLanguageDropdownContainer: d3.select('.intro__language-dropdown'),
  introLanguageDropdownText: d3.select('.intro__language-dropdown-text'),
  introTitleText: d3.select('.intro__title'),
  introSubtitleText: d3.select('.intro__subtitle'),
  introSummaryText: d3.select('.intro__summary'),
  introDisclaimerText: d3.select('.intro__disclaimer'),

  erasMapButtonContainer: d3.select('.eras__map-button'),
  erasStepperLeftButton: d3.select('.eras__stepper-icon-left'),
  erasStepperRightButton: d3.select('.eras__stepper-icon-right'),
  erasTitleContainer: d3.select('.eras__title'),
  erasBackButton: d3.select('.eras__back-button-outer'),
  erasBackButtonText: d3.select('.eras__back-button-text'),
};
