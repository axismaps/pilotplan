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
      eras,
    } = components;

    urlParams.config({ language }).update();
    languageDropdown.config({ language }).update();
    eraDropdown.config({ language }).update();
    intro.config({ language }).update();
    eras.config({ language }).updateLanguage();
  };
  return updateLanguage;
};

export default getUpdateLanguage;
