var ApplicationPolicy = require("./application-policy");
var Authorize = require("./authorize");
var decamelize = require("humps").decamelize;
var pascalize = require("humps").pascalize;
var path = require("path");

var SimpleAuthorization = {};

/**
 * Utility function for the `policy` helper for putting together the data needed by the policies.
 *
 * @param {Function|object|string} classOrRecord The class, class name, or instance of a class
 * @param {object} recordAttributes The plain object representing the record when given a class or class name
 * @returns {object} The policy instance based on the record
 */
function getPolicyData(classOrRecord, recordAttributes) {
  var policyData = SimpleAuthorization.policyData();

  switch (typeof classOrRecord) {
    case "object":
      policyData.modelName = classOrRecord.constructor.name;
      policyData.record = classOrRecord;
      return policyData;
    case "function":
      policyData.modelName = classOrRecord.name;
      policyData.record = recordAttributes;
      return policyData;
    default:
      policyData.modelName = classOrRecord;
      policyData.record = recordAttributes;
      return policyData;
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
  var policyData = getPolicyData(classOrRecord, recordAttributes);

  try {
    var policyPath = path.join(
      SimpleAuthorization.policyDirectory,
      decamelize(policyData.modelName, { separator: "-" }) + "-policy"
    );
    var PolicyClass = require(policyPath);
    if (typeof PolicyClass === "object" && typeof PolicyClass.default === "function") {
      PolicyClass = PolicyClass.default;
    }
    return new PolicyClass(policyData);
  } catch (error) {
    throw new Error("Could not find policy class: " + pascalize(policyData.modelName + "Policy"));
  }
}

SimpleAuthorization.ApplicationPolicy = ApplicationPolicy;
SimpleAuthorization.Authorize = Authorize;
SimpleAuthorization.getPolicyData = getPolicyData;
SimpleAuthorization.policy = policy;

module.exports = SimpleAuthorization;
