const getUpdateMouseEventsDisabled = ({ components }) => {
  const updateMouseEventsDisabled = function updateMouseEventsDisabled() {
    const { mouseEventsDisabled } = this.props();
    const { layout } = components;
    layout
      .config({ mouseEventsDisabled })
      .toggleMouseEvents();
  };
  return updateMouseEventsDisabled;
};

export default getUpdateMouseEventsDisabled;
