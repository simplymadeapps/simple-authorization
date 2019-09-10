var SimpleAuthorization = require("../src");
var getPolicyData = SimpleAuthorization.getPolicyData;

SimpleAuthorization.policyData = () => {
  return { currentUser: { id: 1 }, role: { id: 2, createPost: true, deletePost: false } };
};

class User {}

describe("getPolicyData", () => {
  it("returns the data returned from the assigned `SimpleAuthorization.policyData` function", () => {
    var policyData = getPolicyData();
    expect(policyData.currentUser).toEqual({ id: 1 });
    expect(policyData.role).toEqual({ id: 2, createPost: true, deletePost: false });
  });

  it("adds the modelName based on the given class, className, or instance of a class", () => {
    var policyData = getPolicyData("User");
    expect(policyData.modelName).toBe("User");

    policyData = getPolicyData(User);
    expect(policyData.modelName).toBe("User");

    policyData = getPolicyData(new User());
    expect(policyData.modelName).toBe("User");
  });

  it("adds the record if an instance of a class is given", () => {
    var user = new User();
    var policyData = getPolicyData(user);
    expect(policyData.record).toBe(user);
  });

  it("adds the given attributes as the record object if given with the class or class name", () => {
    var policyData = getPolicyData(User, { id: 10 });
    expect(policyData.record).toEqual({ id: 10 });

    policyData = getPolicyData("User", { id: 20 });
    expect(policyData.record).toEqual({ id: 20 });
  });
});
