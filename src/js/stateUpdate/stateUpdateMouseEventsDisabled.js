/**
 * Callback for mouseEventsDisabled field
 * "mouseEventsDisabled" boolean if all application mouse events are disabled
 * @module
 * @memberof stateUpdate
 */
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
