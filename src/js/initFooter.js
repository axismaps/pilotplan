import Footer from './footer';
import onRasterClick from './onRasterClick';

const initFooter = function initFooter() {
  const { state } = this.components;
  const footer = new Footer({
    translations: this.data.translations,
    language: state.get('language'),
    year: state.get('year'),
    footerView: state.getAutoFooterView(this.data),
    rasterData: state.getAvailableRasters(this.data),
    cachedMetadata: this.cachedMetadata,
    onCategoryClick(newCategory) {
      const currentView = state.get('footerView');
      if (newCategory === currentView) return;
      state.update({ footerView: newCategory });
    },
    onRasterClick(rasterData) {
      onRasterClick({ rasterData, state });
    },
    onAllRasterCloseClick() {
      state.update({ allRasterOpen: false });
    },
    onAllRasterClick() {
      state.update({ allRasterOpen: true });
    },
    onToggleClick(toggle) {
      state.update({ footerOpen: toggle === undefined ? !state.get('footerOpen') : toggle });
    },
  });
  return footer;
};

export default initFooter;
