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
