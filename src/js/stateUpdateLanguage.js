const getUpdateLanguage = ({
  components,
  // data,
}) => {
  const updateLanguage = function updateLanguage() {
    const { language } = this.props();
    const {
      urlParams,
      languageDropdown,
      eraDropdown,
      intro,
    } = components;

    urlParams.config({ language }).update();
    languageDropdown.config({ language }).update();
    eraDropdown.config({ language }).update();
    intro.config({ language }).update();
  };
  return updateLanguage;
};

export default getUpdateLanguage;
