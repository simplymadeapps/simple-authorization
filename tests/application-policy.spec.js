var ApplicationPolicy = require("../src").ApplicationPolicy;

describe("ApplicationPolicy#constructor", () => {
  it("assigns the given properties/values to the policy instance", () => {
    var policy = new ApplicationPolicy({ currentUser: { id: 1 }, someKey: "some value" });
    expect(policy.currentUser).toEqual({ id: 1 });
    expect(policy.someKey).toBe("some value");
  });
});
