/**
 * Module comprises methods related to both intro dropdown menus
 * @module introDropdownBase
 * @memberof intro
 */
const setDropdownListeners = ({
  buttonContainer,
  dropdownContainer,
  getTimer,
  setTimer,
}) => {
  const clearOldTimer = () => {
    const oldTimer = getTimer();
    if (oldTimer !== null) {
      clearTimeout(oldTimer);
    }
  };

  const setMenuCloseTimer = () => {
    const timer = setTimeout(() => {
      dropdownContainer
        .classed('intro__dropdown-on', false);
      setTimer(null);
    }, 250);
    setTimer(timer);
  };

  buttonContainer
    .on('mouseover', () => {
      clearOldTimer();
      dropdownContainer
        .classed('intro__dropdown-on', true);
    })
    .on('mouseout', () => {
      setMenuCloseTimer();
    });

  dropdownContainer
    .on('mouseover', () => {
      clearOldTimer();
    })
    .on('mouseout', () => {
      setMenuCloseTimer();
    });
};

export default setDropdownListeners;
