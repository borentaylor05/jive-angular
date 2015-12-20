
# Installation

```
 npm install jive-angular -g
```

# Command Line Initialization

```
 jive-angular-make [YourAppName]
```

# Basic Usage

Once installed:

1. Navigate to: `./[YourAppName]/apps/[YourAppName]/public`
2. Run: `npm install`
3. Run; `gulp` or `gulp jive`
  * The default gulp task:
    * Precompiles SASS from `app/scss`
    * Transpiles ES2015 in app/js down to ES5
    * Puts all HTML / CSS / JS resources in dist/
    * Stores HTML templates in the $templateCache
      * This is necessary because Jive proxies all calls to the file system, meaning you cannot use templateUrl as expected.
    * Implements a JS linter
    * Implements a watcher so steps 1 and 2 happen on every save
    ** There are several things going on in gulpfile.js so be sure to check it out! **

### 'gulp' vs 'gulp jive'

`gulp` is meant for development. It runs a server and watcher, so your resources are put into dist/ on every save. Run `gulp jive` if you just want your resources to be in their proper place and have no need for reflecting live changes.

### Development setup

** This assumes your app is already installed on your Jive instance **

1. Follow the normal Jive App development process by running `npm start` from your project home directory.
2. Navigate to from your app root to `apps/[YourAppName]/public/` and run `gulp`.

### Angular App Basics
** The newly created public directory uses gulp to set up a template for an Angular SPA using ui-router **

The template contains:

* A primary module called `jive`
* A submodule called `jive.home`
* A route file with 3 sample routes
  * One route is abstract. It contains the header_footer template.
* A service (app/services/HTTP.js) for resolving $http CRUD calls
  * NOTE: This file uses a decent amount of ES6 if you are interested.

# How It Works

** The command line function above does the following: **

1. Creates a new directory named [YourAppName] in your current working directory.
2. Creates a jive app titled [YourAppName] by finding and executing the jive-sdk executable.
  * The exact command is: `jive-sdk create app --name="[YourAppName]"`
3. Empties the public directory at: `[YourAppName]/apps/[YourAppName]/public`
4. Repopulates that directory with another node app. This app creates a basic AngularJS template Jive SDK applications.
