var Authorize = require("../src").Authorize;
var React = require("react");
var shallow = require("enzyme").shallow;
var SimpleAuthorization = require("../src");

let mockPolicyInstance;
beforeEach(() => {
  jest.spyOn(SimpleAuthorization, "policy").mockImplementation(() => {
    return mockPolicyInstance;
  });
});

describe("Authorize#isPermitted", () => {
  beforeEach(() => {
    mockPolicyInstance = { new: jest.fn(), update: jest.fn() };
  });

  describe("when the 'containing' prop is given", () => {
    it("passes the 'on' prop and 'containing' prop to call the 'perform' prop on the matching policy", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize perform="update" on="User" containing={{ id: 5 }}>
          <button className="update-user" />
        </Authorize>
      );
      SimpleAuthorization.policy.mockClear();
      mockPolicyInstance.update.mockClear();

      expect(component.instance().isPermitted()).toBe(true);
      expect(SimpleAuthorization.policy.mock.calls).toEqual([["User", { id: 5 }]]);
      expect(mockPolicyInstance.update.mock.calls.length).toBe(1);
    });

    it("returns the opposite boolean if the `cannot` prop is used", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize cannot perform="update" on="User" containing={{ id: 5 }}>
          <button className="update-user" />
        </Authorize>
      );

      expect(component.instance().isPermitted()).toBe(false);
    });
  });

  describe("when the 'containing' prop is not given", () => {
    it("passes the 'on' prop to call the 'perform' prop on the matching policy", () => {
      mockPolicyInstance.new.mockReturnValue(false);

      const component = shallow(
        <Authorize perform="new" on="user">
          <button className="new-user" />
        </Authorize>
      );
      SimpleAuthorization.policy.mockClear();
      mockPolicyInstance.new.mockClear();

      expect(component.instance().isPermitted()).toBe(false);
      expect(SimpleAuthorization.policy.mock.calls).toEqual([["user"]]);
      expect(mockPolicyInstance.new.mock.calls.length).toBe(1);
    });

    it("returns the opposite boolean if the `cannot` prop is used", () => {
      mockPolicyInstance.update.mockReturnValue(true);

      const component = shallow(
        <Authorize cannot perform="new" on="user">
          <button className="new-user" />
        </Authorize>
      );

      expect(component.instance().isPermitted()).toBe(true);
    });
  });
});

describe("Authorize#render", () => {
  beforeEach(() => {
    mockPolicyInstance = { view: jest.fn() };
  });

  it("renders the child components when the user is permitted", () => {
    mockPolicyInstance.view.mockReturnValue(true);

    const component = shallow(
      <Authorize perform="view" on="UserBoard">
        <div className="user-board" />
      </Authorize>
    );

    expect(component.instance().render()).toEqual(<div className="user-board" />);
  });

  it("returns `null` when the user is not permitted", () => {
    mockPolicyInstance.view.mockReturnValue(false);

    const component = shallow(
      <Authorize perform="view" on="UserBoard">
        <div className="user-board" />
      </Authorize>
    );

    expect(component.instance().render()).toBe(null);
  });
});
