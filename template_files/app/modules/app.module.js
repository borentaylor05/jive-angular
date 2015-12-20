(() => {
  'use strict';

  window.jQuery = window.$ = require('jquery');

  require('angular');
  require('angular-cookies');
  require('angular-ui-router');

  angular.module('jive', [
    'ui.router',
    'ngCookies',
    'templates',
    'jive.home'
  ]);

  require('./modules_require.js');
  //require('../services/services_require.js');
  //require('../components/components_require.js');

})();
