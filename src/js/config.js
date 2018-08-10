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

