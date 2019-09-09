var decamelize = require("humps").decamelize;
var pascalize = require("humps").pascalize;
var path = require("path");
var SimpleAuthorization = {};

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

/**
 * Helper for returning the matching policy based on the given class name or record.
 *
 * @param {Function|object|string} classOrRecord The class, class name, or instance of a class
 * @param {object} recordAttributes The plain object representing the record when given a class or class name
 * @returns {object} The policy instance based on the record
 * @example
 *   // Checks against UserPolicy#new
 *   policy(User).new();
 *
 *   // Checks against StatusPolicy#update
 *   policy(new Status({ userId: 5 })).update();
 *
 *   // Checks against UserPolicy#update
 *   policy("User", { id: 5 }).update();
 */
function policy(classOrRecord, recordAttributes) {
  var modelName;
  var record;

  switch (typeof classOrRecord) {
    case "object":
      modelName = classOrRecord.constructor.name;
      record = classOrRecord;
      break;
    case "function":
      modelName = classOrRecord.name;
      record = recordAttributes;
      break;
    default:
      modelName = classOrRecord;
      record = recordAttributes;
      break;
  }

  var policyData = SimpleAuthorization.policyData();
  policyData.record = record;

  try {
    var policyPath = path.join(
      SimpleAuthorization.policyDirectory,
      decamelize(modelName, { separator: "-" }) + "-policy"
    );
    var PolicyClass = require(policyPath);
    if (typeof PolicyClass === "object" && typeof PolicyClass.default === "function") {
      PolicyClass = PolicyClass.default;
    }
    return new PolicyClass(policyData);
  } catch (error) {
    throw new Error("Could not find policy class: " + pascalize(modelName + "Policy"));
  }
}

SimpleAuthorization.ApplicationPolicy = ApplicationPolicy;
SimpleAuthorization.policy = policy;

module.exports = SimpleAuthorization;
