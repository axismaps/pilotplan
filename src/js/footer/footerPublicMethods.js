/**
 * Module comprises public (prototype) methods for footer module, Footer class
 * @module footerPublicMethods
 * @memberof footer
 */

const getPublicMethods = ({ privateProps, privateMethods }) => ({
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  },

  updateRasterData() {
    const {
      drawRasters,
      updateFooterDataStatus,
      updateFooterView,
      drawToggleRasters,
      updateToggleYear,
    } = privateMethods;

    updateFooterDataStatus.call(this);
    updateFooterView.call(this);
    drawToggleRasters.call(this);
    updateToggleYear.call(this);
    drawRasters.call(this);
    return this;
  },

  updateAllRaster() {
    const {
      allRasterOpen,
    } = privateProps.get(this);
    const {
      drawAllRaster,
    } = privateMethods;

    if (allRasterOpen) {
      drawAllRaster.call(this);
    }
  },
  updateLanguage() {
    const {
      language,
      translations,
      footerToggleText,
      footerShowAllCircle,
    } = privateProps.get(this);

    footerToggleText
      .text(translations['Historical Overlays'][language]);

    footerShowAllCircle
      .text(translations['Show all'][language]);
  },
});

export default getPublicMethods;
