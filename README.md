# Simple Authorization

[![Build Status](https://travis-ci.org/simplymadeapps/simple-authorization.svg?branch=master)](https://travis-ci.org/simplymadeapps/simple-authorization)
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

Initialize Simple Authorization to point to the directory with your policy classes
and to configure the data made available to your policy classes.

```js
import SimpleAuthorization from "simple-authorization";

// Assign the policy directory to load policy classes by naming convention.
SimpleAuthorization.policyDirectory = require("path").resolve("src/policies");

// Assign a function that will return the data you need in each of your policies to make authorization decisions.
SimpleAuthorization.policyData = () => {
  const currentUser = { id: 5 };
  const role = {
    createPost: true,
    editOwnPost: true,
    editOthersPost: false
  };

  return { currentUser, role };
};
```

## Usage

Create your policy class with the methods needed to determine whether the user is permitted to perform an action.

```js
import { ApplicationPolicy } from "simple-authorization";

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
   * Permission to edit a blog post. In this example, we need to know if the post was
   * created by the current user or another user when checking the user's permissions.
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

The policies can be used in multiple ways by using the `policy()` helper method. Each of the policy classes
will be loaded based on the name of the policy.

```js
import { policy } from "simple-authorization";

// This will initialize the PostPolicy class with the data passed in from
// the return value of the `SimpleAuthorization.policyData` function.
policy("Post").create();
// => true

const post = new Post({ userId: 10 });

// This will also initialize the PostPolicy class because of the post instance's constructor name,
// and it will also make the post instance available as `this.record` in the PostPolicy `edit` method.
policy(post).edit();
// => false

// If you don't have an instance of a class, you can still make a plain object available as `this.record`.
policy("Post", { userId: 5 }).edit();
// => true
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License

This module is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
