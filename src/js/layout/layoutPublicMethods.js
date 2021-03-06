/**
 * Module comprises public methods for the layout module
 * @module layoutPublicMethods
 * @memberof layout
 */
const getPublicMethods = ({ privateProps, privateMethods }) => ({
  config(config) {
    const props = privateProps.get(this);
    props.previousEra = props.currentEra;
    Object.assign(privateProps.get(this), config);
    return this;
  },
  updateHighlightedFeature() {
    const {
      outerContainer,
      highlightedFeature,
      dataProbeMobileTitle,
      dataProbeMobileContent,
    } = privateProps.get(this);

    outerContainer
      .classed('outer-container--highlighted', highlightedFeature !== null);

    if (highlightedFeature == null) return;

    dataProbeMobileTitle
      .text(highlightedFeature.properties.Name);

    const start = highlightedFeature.properties.FirstYear;
    const end = highlightedFeature.properties.LastYear === 8888 ?
      new Date().getFullYear() :
      highlightedFeature.properties.LastYear;

    const creator = highlightedFeature.properties.Creator;

    let content = '';

    const addContentRow = (text) => {
      content += `
      <div class="mobile-probe__content-row">
        ${text}
      </div>
    `;
    };
    if (creator !== '') {
      addContentRow(`Creator: ${creator}`);
    }

    addContentRow(`Mapped: ${start} - ${end}`);

    dataProbeMobileContent
      .html(content);
  },
  updateRasterProbe() {
    const {
      outerContainer,
      rasterProbeOpen,
    } = privateProps.get(this);

    outerContainer.classed('raster-probe-on', rasterProbeOpen);
  },
  updateOverlay() {
    const {
      outerContainer,
      overlayOn,
    } = privateProps.get(this);

    outerContainer.classed('overlay-on', overlayOn);
  },
  updateSidebar() {
    const {
      outerContainer,
      sidebarOpen,
    } = privateProps.get(this);

    outerContainer.classed('sidebar-open', sidebarOpen);
  },
  updateLocation() {
    const {
      outerContainer,
      sidebarContainer,
      zoomedOut,
      rotated,
    } = privateProps.get(this);

    outerContainer.classed('rotated', rotated);
    sidebarContainer.classed('sidebar--zoom-hint', zoomedOut);
  },
  removeSidebarToggleLabel() {
    const props = privateProps.get(this);
    const {
      sidebarToggleHelpContainer,
      sidebarOpened,
    } = props;
    if (sidebarOpened) return;

    props.sidebarOpen = true;
    sidebarToggleHelpContainer.remove();
  },
  updateFooter() {
    const {
      outerContainer,
      footerOpen,
    } = privateProps.get(this);
    const { updateFooter } = privateMethods;

    updateFooter({ outerContainer, footerOpen });
  },
  updateAreaSearch() {
    const {
      probeButtonsContainer,
      areaSearchActive,
    } = privateProps.get(this);
    probeButtonsContainer.classed('probe-buttons-container--area-search', areaSearchActive);
  },
  updateAllRaster() {
    const {
      allRasterOpen,
      outerContainer,
    } = privateProps.get(this);

    outerContainer.classed('allraster-open', allRasterOpen);
  },
  updateEra() {
    const {
      currentEra,
      previousEra,
      language,
    } = privateProps.get(this);

    const { setErasButtonText } = privateMethods;

    if (previousEra[language] === currentEra[language]) return;

    setErasButtonText.call(this);
  },
  toggleMouseEvents() {
    const { outerContainer, mouseEventsDisabled } = privateProps.get(this);
    outerContainer.classed('mouse-disabled', mouseEventsDisabled);
  },
  toggleTransitions() {
    const { outerContainer, transitionsDisabled } = privateProps.get(this);
    outerContainer.classed('transitions-disabled', transitionsDisabled);
  },
  removeHintProbe() {
    const props = privateProps.get(this);
    const {
      hintProbeContainer,
      hintProbeContainerMobile,
      hintProbeOn,
    } = props;
    if (!hintProbeOn) return;
    hintProbeContainer.remove();
    hintProbeContainerMobile.remove();
    props.hintProbeOn = false;
  },
  updateLanguage() {
    const {
      setHintProbeLanguage,
      setAreaProbeLanguage,
      setRegisterButtonLanguage,
      setErasButtonText,
      setErasBackButtonText,
    } = privateMethods;
    setHintProbeLanguage.call(this);
    setAreaProbeLanguage.call(this);
    setRegisterButtonLanguage.call(this);
    setErasButtonText.call(this);
    setErasBackButtonText.call(this);
  },
  updateRegisterScreen() {
    const {
      registerOpen,
      registerOuterContainer,
    } = privateProps.get(this);
    registerOuterContainer
      .classed('register__outer--on', registerOpen);
  },
  updateMapLoaded() {
    const {
      loadingScreenContainer,
      mapLoaded,
    } = privateProps.get(this);
    if (mapLoaded) {
      loadingScreenContainer
        .style('opacity', 1)
        .transition()
        .duration(750)
        .style('opacity', 0)
        .remove();
    }
  },
  updateMobile() {
    const {
      outerContainer,
      mobile,
    } = privateProps.get(this);
    outerContainer
      .classed('outer-container--desktop', !mobile)
      .classed('outer-container--mobile', mobile);
  },
});

export default getPublicMethods;
