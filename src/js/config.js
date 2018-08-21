export const eras = [
  {
    center: [-15.793936, -47.882797],
    dates: [1892, 1955],
    name: 'Future Federal District',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1955, 1965],
    name: 'Design, Construction, and Inauguration',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1964, 1985],
    name: 'Military Dictatorship',
    zoom: null,
  },
  {
    center: [-15.793936, -47.882797],
    dates: [1985, new Date().getFullYear()],
    name: 'New Republic',
    zoom: null,
  },
];

export const colors = {
  highlightColor: 'rgb(1, 34, 95)',
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

  categoriesContainer: d3.select('.footer__categories'),
  imagesContainer: d3.select('.footer__images'),
  showAllContainer: d3.select('.footer__show-all'),
  allRasterOuterContainer: d3.select('.allraster__outer'),
  allRasterInnerContainer: d3.select('.allraster__inner'),
  allRasterContentContainer: d3.select('.allraster__content'),

  mapContainer: d3.select('#map'),

  timelineContainer: d3.select('.timeline-container'),
  sliderContainer: d3.select('.timeline-slider-container'),
  stepperTextContainer: d3.select('.timeline-stepper__year'),
  stepperLeftButton: d3.select('.timeline-stepper__left'),
  stepperRightButton: d3.select('.timeline-stepper__right'),
};
