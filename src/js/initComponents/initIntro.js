import Intro from '../intro/intro';
import LanguageDropdown from '../intro/introLanguageDropdown';
import EraDropdown from '../intro/introEraDropdown';

const initIntro = function initIntro() {
  const { state } = this.components;

  this.components.intro = new Intro({
    onBeginButtonClick: () => {
      state.update({ view: 'map' });
    },
    onJumpButtonClick: () => {
      state.update({ view: 'eras' });
    },
    translations: this.data.translations,
    language: state.get('language'),
  });

  this.components.languageDropdown = new LanguageDropdown({
    language: state.get('language'),
    onClick: () => {
      const currentLanguage = state.get('language');
      state.update({ language: currentLanguage === 'en' ? 'pr' : 'en' });
    },
  });

  this.components.eraDropdown = new EraDropdown({
    language: state.get('language'),
    onClick: (era) => {
      state.update({
        year: era.dates[0],
        view: 'eras',
      });
    },
    eras: this.data.eras,
    translations: this.data.translations,
  });
};

export default initIntro;
