import Eras from './eras';

const initEras = function initEras() {
  const { state } = this.components;

  this.components.eras = new Eras({
    language: state.get('language'),
    eras: this.data.eras,
    onMapButtonClick: () => {
      state.update({ view: 'map' });
    },
    updateYear: (newYear) => {
      state.update({ year: newYear });
    },
    mouseEventsDisabled: (disabled) => {
      state.update({ mouseEventsDisabled: disabled });
    },
    year: state.get('year'),
    view: state.get('view'),
    translations: this.data.translations,
  });
};

export default initEras;
