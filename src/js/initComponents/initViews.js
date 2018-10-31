import Views from '../views';

const initViews = function initViews() {
  const { state } = this.components;
  this.components.views = new Views({
    view: state.get('view'),
    initialize: {
      map: () => {
        this.initComponents();
        this.listenForResize();
      },
    },
    mapLoaded: state.get('mapLoaded'),
  });

  this.components.views.updateView();
};

export default initViews;
