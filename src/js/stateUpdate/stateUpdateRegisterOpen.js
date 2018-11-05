/**
 * Callback for registerOpen field
 * "registerOpen" boolean represents open / close status of register screen
 * @module
 * @memberof stateUpdate
 */
const getUpdateRegisterOpen = ({ components }) => {
  const updateRegisterOpen = function updateRegisterOpen() {
    const { registerOpen } = this.props();
    const { layout } = components;

    layout
      .config({ registerOpen })
      .updateRegisterScreen();
  };
  return updateRegisterOpen;
};

export default getUpdateRegisterOpen;
