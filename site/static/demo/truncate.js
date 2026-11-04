function truncateContext(text, budget) {
  return text.slice(0, budget);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { truncateContext };
}
