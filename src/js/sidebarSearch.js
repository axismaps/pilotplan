const searchMethods = ({ privateProps }) => ({
  listenForText() {
    const {
      searchInput,
      onTextInput,
    } = privateProps.get(this);

    searchInput.on('input', function getValue() {
      const val = d3.select(this).node().value;

      onTextInput(val);
    });
  },
});

export default searchMethods;
