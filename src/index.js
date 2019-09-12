var PropTypes = require("prop-types");
var React = require("react");

var SimpleAuthorization = {};

/**
 * Component for conditionally rendering child components based on the current user's permissions.
 *
 * @example
 *   // Checks against UserPolicy#new
 *   <Authorize perform="new" on={User}>
 *     <button>New User</button>
 *   </Authorize>
 *
 *   // Checks against StatusPolicy#update
 *   <Authorize perform="update" on={new Status({ userId: 1 })}>
 *     <button>Update Status</button>
 *   </Authorize>
 *
 *   // Checks against UserPolicy#update
 *   <Authorize perform="update" on="User" containing={{ id: 5 }}>
 *     <button>Edit User</button>
 *   </Authorize>
 */
class Authorize extends React.Component {
  /**
   * Returns whether the user is permitted to perform the action.
   *
   * @returns {boolean} Whether the user is permitted
   */
  isPermitted() {
    var isPermitted;

    if (this.props.containing == null) {
      isPermitted = SimpleAuthorization.policy(this.props.on)[this.props.perform]();
    } else {
      isPermitted = SimpleAuthorization.policy(this.props.on, this.props.containing)[this.props.perform]();
    }

    return this.props.cannot ? !isPermitted : isPermitted;
  }

  /**
   * Conditionally renders the child components based on the user's permissions.
   *
   * @returns {object|null} The React element or null if not permitted
   */
  render() {
    if (this.isPermitted()) {
      return this.props.children;
    }

    return null;
  }
}

Authorize.propTypes = {
  cannot: PropTypes.bool,
  containing: PropTypes.object,
  on: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]).isRequired,
  perform: PropTypes.string.isRequired
};

/**
 * Utility function for the `policy` helper for putting together the data needed by the policies.
 *
 * @param {Function|object|string} classOrRecord The class, class name, or instance of a class
 * @param {object} recordAttributes The plain object representing the record when given a class or class name
 * @returns {object} The policy instance based on the record
 */
function getPolicyData(classOrRecord, recordAttributes) {
  var policyData = {};

  try {
    policyData = SimpleAuthorization.policyData();
  } catch (error) {
    throw new Error("SimpleAuthorization.policyData must be set to a function that returns an object");
  }

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
    var PolicyClass = SimpleAuthorization.policyResolver(policyData.modelName);
    return new PolicyClass(policyData);
  } catch (error) {
    throw new Error("SimpleAuthorization.policyResolver could not resolve a policy class for " + policyData.modelName);
  }
}

SimpleAuthorization.Authorize = Authorize;
SimpleAuthorization.getPolicyData = getPolicyData;
SimpleAuthorization.policy = policy;

module.exports = SimpleAuthorization;
