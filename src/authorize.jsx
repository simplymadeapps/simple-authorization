var policy = require(".").policy;
var PropTypes = require("prop-types");
var React = require("react");

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
    if (this.props.containing == null) {
      return policy(this.props.on)[this.props.perform]();
    }

    return policy(this.props.on, this.props.containing)[this.props.perform]();
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
  containing: PropTypes.object,
  on: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]).isRequired,
  perform: PropTypes.string.isRequired
};

module.exports = Authorize;
