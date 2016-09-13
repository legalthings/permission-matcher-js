Legal Things - Permission matcher JS
==================

Port of [legalthings/permission-matcher](https://github.com/legalthings/permission-matcher).
With the permission matcher library, you can check whether a user is allowed to have access to specific resources.
Specifying resources and access control levels is up to the client of the library.

## Installation

The library can be installed using npm.

    npm install permission-matcher-js

It can also be installed with bower.

    bower install permission-matcher-js

## How it works

The library exposes one function with which you can get a list of privileges for matching authz groups.
Authz groups can be anything you want, in the example below resource URIs are used, but you could also use a string of any format.
In the example we have a user that has certain permissions attached to him. We can then ask the `PermissionMatcher` class to extract the permissions of the users for a given authz group.
Note that you can use wildcards `*`.

```javascript
const PermissionMatcher = require('permission-matcher-js');
const matcher = new PermissionMatcher();

let permissionsThatSomeUserHas = {
    '/organizations/0001': ['full-access'],
    '/organizations/0002?list=all': 'list',
    '/organizations/0003/*/foo': ['read', 'write']
};

console.log(matcher.match(permissionsThatSomeUserHas, ['/organizations/0001']));
// outputs ['full-access']

console.log(matcher.match(permissionsThatSomeUserHas, ['/organizations/0001', '/organizations/0003/random/foo']));
// outputs ['full-access', 'read', 'write']

console.log(matcher.match(permissionsThatSomeUserHas, ['/organizations/0002']));
// outputs []

console.log(matcher.match(permissionsThatSomeUserHas, ['/organizations/0002?list=all']));
// outputs ['list']

console.log(matcher.match(permissionsThatSomeUserHas, ['/organizations/*']));
// outputs ['full-access', 'read', 'write']
```

## Releasing a new build
When changes are made to the source `/src/permission-matcher.js`, which is used for `NPM`, make sure to update the `Bower` version aswell.
Note that this process is currently done manually and should be automated in the future.

	npm run browserify
	npm run babel
