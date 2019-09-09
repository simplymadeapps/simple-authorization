var Es6Policy = require("./__support__/policies/es6-policy").default;
var path = require("path");
var SimpleAuthorization = require("../src");
var UserPolicy = require("./__support__/policies/user-policy");
var policy = SimpleAuthorization.policy;

SimpleAuthorization.policyDirectory = path.resolve("tests/__support__/policies");
SimpleAuthorization.policyData = () => {
  return { currentUser: { id: 1 }, role: { id: 2, createPost: true, deletePost: false } };
};

class MockMissingClass {}
class User {}

describe("policy", () => {
  it("returns an instance of the matching policy class when given a string", () => {
    var userPolicy = policy("user");
    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBe(undefined);
    expect(userPolicy.role.id).toBe(2);
  });

  it("accepts an object for dynamic behavior when given a string", () => {
    var userPolicy = policy("user", { id: 100 });
    expect(userPolicy.record).toEqual({ id: 100 });
  });

  it("returns an instance of the matching policy class when given a class", () => {
    var userPolicy = policy(User);
    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBe(undefined);
    expect(userPolicy.role.id).toBe(2);
  });

  it("accepts an object for dynamic behavior when given a class", () => {
    var userPolicy = policy(User, { id: 100 });
    expect(userPolicy.record).toEqual({ id: 100 });
  });

  it("returns an instance of the matching policy class when given an instance of a class", () => {
    var user = new User();
    var userPolicy = policy(user);
    expect(userPolicy).toEqual(expect.any(UserPolicy));
    expect(userPolicy.currentUser.id).toBe(1);
    expect(userPolicy.record).toBe(user);
    expect(userPolicy.role.id).toBe(2);
  });

  it("supports exporting a policy class via `export default`", () => {
    var es6Policy = policy("Es6");
    expect(es6Policy).toEqual(expect.any(Es6Policy));
  });

  it("raises an error if a matching policy cannot be found", () => {
    expect(() => {
      policy("mock-missing-class");
    }).toThrowError("Could not find policy class: MockMissingClassPolicy");

    expect(() => {
      policy(MockMissingClass);
    }).toThrowError("Could not find policy class: MockMissingClassPolicy");

    expect(() => {
      policy(new MockMissingClass());
    }).toThrowError("Could not find policy class: MockMissingClassPolicy");
  });
});
