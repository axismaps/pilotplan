/**
 * Callback for transitionsDisabled field
 * "transitionsDisabled" boolean represents if menu transitions are disabled
 * @module
 * @memberof stateUpdate
 */
const getUpdateTransitionsDisabled = ({
  components,
}) => {
  const updateTransitionsDisabled = function updateTransitionsDisabled() {
    const { transitionsDisabled } = this.props();
    const { layout } = components;

    layout
      .config({
        transitionsDisabled,
      })
      .toggleTransitions();
  };

  return updateTransitionsDisabled;
};

export default getUpdateTransitionsDisabled;
