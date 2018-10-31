import Views from '../views';

const initViews = function initViews() {
  const { state } = this.components;
  this.components.views = new Views({
    view: state.get('view'),
    initialize: {
      map: () => {
        // this initializes components on first toggle to map view
        // if components aren't already initialized from loading on map view
        this.initComponents();
        this.listenForResize();
      },
    },
    mapLoaded: state.get('mapLoaded'),
  });

  this.components.views.updateView();
};

export default initViews;
