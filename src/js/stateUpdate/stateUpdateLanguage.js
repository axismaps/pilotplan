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
      sidebar,
      layout,
      footer,
      atlas,
    } = components;

    urlParams.config({ language }).update();
    languageDropdown.config({ language }).update();
    eraDropdown.config({ language }).update();
    intro.config({ language }).update();
    eras.config({ language }).updateLanguage();
    sidebar.config({ language }).updateLanguage();
    layout.config({ language }).updateLanguage();
    footer.config({ language }).updateLanguage();
    atlas.config({ language });
  };
  return updateLanguage;
};

export default getUpdateLanguage;
