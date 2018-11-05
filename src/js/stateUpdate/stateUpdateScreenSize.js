/**
 * Callback for when screen is resized
 * @module
 * @memberof stateUpdate
 */
const getUpdateScreenSize = ({ components }) => {
  const updateScreenSize = function updateScreenSize() {
    const {
      timeline,
    } = components;

    timeline
      .updateScreenSize();
  };
  return updateScreenSize;
};

export default getUpdateScreenSize;
