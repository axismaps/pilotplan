import Footer from '../footer/footer';
// import onRasterClick from './onRasterClick';
import rasterMethods from '../rasterMethods';

const initFooter = function initFooter() {
  const { state } = this.components;
  const { onRasterClick } = rasterMethods;

  this.components.footer = new Footer({
    translations: this.data.translations,
    language: state.get('language'),
    year: state.get('year'),
    mobile: state.get('mobile'),
    footerView: state.get('footerView'),
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
};

export default initFooter;
