const getPublicMethods = ({ privateProps, privateMethods }) => ({
  config(config) {
    const props = privateProps.get(this);
    props.previousEra = props.currentEra;
    Object.assign(privateProps.get(this), config);
    return this;
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
    const { hintProbeContainer, hintProbeOn } = props;
    if (!hintProbeOn) return;
    hintProbeContainer.remove();
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
});

export default getPublicMethods;
