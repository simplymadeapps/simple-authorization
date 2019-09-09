var ApplicationPolicy = require("../../../src").ApplicationPolicy;

/**
 * Policy for managing users.
 */
class UserPolicy extends ApplicationPolicy {
  /**
   * Permission to update a user.
   *
   * @returns {boolean} Whether the user is permitted
   */
  update() {
    if (this.record.id === this.currentUser.id) {
      return true;
    }

    return this.role.manageCompanyAndUsers;
  }
}

module.exports = UserPolicy;
