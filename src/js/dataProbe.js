const privateProps = new WeakMap();

const privateMethods = {

};

class DataProbe {
  constructor(config) {
    privateProps.set(this, {
      pos: null,
      probe: null,
      html: '',
      className: null,
      leader: false,
      container: null,
    });

    this.config(config);
  }
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
  draw() {
    const props = privateProps.get(this);
    const {
      pos,
      container,
      html,
    } = props;
    console.log('pos', pos);

    const posStyle = Object.keys(pos)
      .reduce((accumulator, key) => {
        /* eslint-disable no-param-reassign */
        accumulator[key] = `${pos[key]}px`;
        /* eslint-enable no-param-reassign */
        return accumulator;
      }, {});

    const styles = Object.assign({
      position: 'absolute',
      opacity: 0,
    }, posStyle);
    console.log('styles', styles);

    props.probe = container
      .append('div')
      .attr('class', 'data-probe')
      .styles(styles);

    props.probe
      .append('div')
      .attr('class', 'data-probe__inner')
      .html(html);

    const probeWidth = props.probe.node()
      .getBoundingClientRect()
      .width;

    props.probe
      .styles({
        opacity: 1,
        left: `${pos.left - (probeWidth / 2)}px`,
      });
  }
  // move() {

  // }
  remove() {
    const {
      probe,
    } = privateProps.get(this);
    if (probe === null || probe === undefined) return;

    probe.remove();
  }
  getPos() {
    return privateProps.get(this).pos;
  }
}

export default DataProbe;
