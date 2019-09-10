var ApplicationPolicy = require("./application-policy");

/**
 * Policy for testing ES6 exporting as default.
 */
class Es6Policy extends ApplicationPolicy {}

module.exports = { default: Es6Policy };
