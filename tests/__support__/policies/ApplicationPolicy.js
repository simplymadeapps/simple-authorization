/**
 * Base policy that makes data needed for authorization available to each of the policy classes. A record will
 * also be made available for permissions that differ based on the record the action is being performed on.
 */
class ApplicationPolicy {
  /**
   * Initializes the policy instance with the required data.
   *
   * @param {object} policyData The data needed for all policies
   */
  constructor(policyData) {
    var keys = Object.keys(policyData);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this[key] = policyData[key];
    }
  }
}

module.exports = ApplicationPolicy;
