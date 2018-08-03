const searchMethods = ({ privateProps, privateMethods }) => ({
  listenForText() {
    const {
      searchInput,
      onTextInput,
    } = privateProps.get(this);
    console.log('listen');

    searchInput.on('input', function getValue() {
      const val = d3.select(this).node().value;
      console.log('type', val);
      if (val.length >= 3) {
        onTextInput(val);
      }
    });
  },
});

export default searchMethods;
