# Simple Authorization

[![Build Status](https://github.com/simplymadeapps/simple-authorization/actions/workflows/tests.yml/badge.svg)](https://github.com/simplymadeapps/simple-authorization/actions/workflows/tests.yml)
[![Code Climate](https://codeclimate.com/github/simplymadeapps/simple-authorization/badges/gpa.svg)](https://codeclimate.com/github/simplymadeapps/simple-authorization)
[![Test Coverage](https://codeclimate.com/github/simplymadeapps/simple-authorization/badges/coverage.svg)](https://codeclimate.com/github/simplymadeapps/simple-authorization/coverage)

Simple Authorization is a JavaScript library inspired by [Pundit](https://github.com/varvet/pundit)
for performing user authorization using simple JavaScript classes. If you've used Pundit in
a Ruby project, you'll be instantly familiar.

## Installation

Install the package via [Yarn](https://yarnpkg.com):

```bash
yarn add simple-authorization
```

## Configuration

Initialize Simple Authorization to configure the data made available to your policy classes,
and configure the policy class to use based on the name of the model that's being authorized.

```js
import CommentPolicy from "../policies/comment-policy";
import PostPolicy from "../policies/post-policy";
import SimpleAuthorization from "simple-authorization";

// Assign a function that will return the data you need in
// each of your policies to make authorization decisions.
SimpleAuthorization.policyData = () => {
  const currentUser = { id: 5 };
  const role = {
    createPost: true,
    editOwnPost: true,
    editOthersPost: false
  };

  return { currentUser, role };
};

// Assign a function that will return your
// policy class based on the given model name.
SimpleAuthorization.policyResolver = modelName => {
  switch (modelName) {
    case "Comment":
      return CommentPolicy;
    case "Post":
      return PostPolicy;
  }
};
```

## Usage

Create a base policy class to assign the data passed into the constructor to make it available to each policy.

```js
class ApplicationPolicy {
  /**
   * Initializes the policy instance with the required data.
   *
   * @param {object} policyData The data needed for all policies
   */
  constructor({ currentUser, record, role }) {
    this.currentUser = currentUser;
    this.record = record;
    this.role = role;
  }
}
```

Create your policy class with the methods needed to determine whether the user is permitted to perform an action.

```js
class PostPolicy extends ApplicationPolicy {
  /**
   * Permission to create a blog post.
   *
   * @returns {boolean} Whether the user is permitted
   */
  create() {
    return this.role.createPost;
  }

  /**
   * Permission to edit a blog post. In this example, we need to
   * know if the post was created by the current user or another
   * user when checking the user's permissions.
   *
   * `this.record` is the object we're passing in when calling `policy()`.
   *
   * @returns {boolean} Whether the user is permitted
   */
  edit() {
    if (this.record.userId === this.currentUser.id) {
      return this.role.editOwnPost;
    }

    return this.role.editOthersPost;
  }
}
```

The policies can be used in multiple ways by using the `policy()` helper method. The policy class that is
used is determined by the `SimpleAuthorization.policyResolver` function we defined in the configuration step.

```js
import { policy } from "simple-authorization";

// This will initialize the PostPolicy class with the data passed in from
// the return value of the `SimpleAuthorization.policyData` function.
policy("Post").create();
// => true

const post = new Post({ userId: 10 });

// This will also initialize the PostPolicy class because of the post
// instance's constructor name, and it will also make the post instance
// available as `this.record` in the PostPolicy `edit` method.
policy(post).edit();
// => false

// If you don't have an instance of a class, you can still make a plain
// object available as `this.record`.
policy("Post", { userId: 5 }).edit();
// => true
```

## React

Simple Authorization also includes an `<Authorize>` React component for wrapping items that should
be conditionally displayed based on the user's permissions.

```jsx
import { Authorize } from "simple-authorization";

export default props => {
  return (
    <div>
      <Authorize perform="create" on="Post">
        <button>New Post</button>
      </Authorize>

      <Authorize perform="edit" on={new Post({ userId: 10 })}>
        <button>Edit Post</button>
      </Authorize>

      <Authorize perform="edit" on="Post" containing={{ userId: 5 }}>
        <button>Edit Post</button>
      </Authorize>
    </div>
  );
};
```

Because the `SimpleAuthorization.policyData` function isn't aware of when the data returned changes,
the `<Authorize>` component keeps track of each of the mounted instances so they can be forced
to render when your policy data changes.

```js
import { Authorize } from "simple-authorization";
import store from "./store"; // Redux store

let currentUserRole;
store.subscribe(() => {
  let previousUserRole = currentUserRole;
  currentUserRole = store.getState().userRole;

  if (previousUserRole !== currentUserRole) {
    Authorize.forceUpdateAll();
  }
});
```

If you're looking to render markup for when a user is not permitted to perform an action, simply add `cannot`.

```jsx
import { Authorize } from "simple-authorization";

export default props => {
  return (
    <Authorize cannot perform="create" on="Post">
      <div>You are not authorized to create new posts.</div>
    </Authorize>
  );
};
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

This module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
