const setStateEvents = ({ components }) => {
  const { state } = components;
  state.registerCallbacks({
    year() {
      const {
        timeline,
        atlas,
      } = components;
      const {
        year,
      } = this.props();
      console.log('year', year);

      timeline
        .config({
          year,
        })
        .updateYear();

      atlas
        .config({
          year,
        })
        .updateYear();
    },
  });
};

export default setStateEvents;
