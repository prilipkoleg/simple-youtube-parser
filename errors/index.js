class ParserError extends Error {}
class InitializationError extends ParserError {}

module.exports = {
  ParserError, InitializationError
};