(function() {
  'use strict';

  angular
    .module('jive.home')
    .config(configRoutes);

  configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

  function configRoutes($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('jive-default', {
        abstract: true,
        templateProvider: function($templateCache){
          return $templateCache.get('components/header_footer/header_footer.html');
        }
      })
      .state('home', {
        parent: 'jive-default',
        url: '/',
        templateProvider: function($templateCache){
          return $templateCache.get('modules/jive/jive_home.html');
        },
        controller: 'JiveController',
        controllerAs: 'jiveCtrl'
      })
      .state('test', {
        parent: 'jive-default',
        url: '/test',
        templateUrl: 'modules/jive/test.html'
      });
    $urlRouterProvider.otherwise('/');
  }
})();
