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
