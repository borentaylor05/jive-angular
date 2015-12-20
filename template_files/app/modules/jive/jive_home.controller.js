(() => {
  'use strict';

  angular.module('jive.home')
    .controller('JiveController', JiveController);

  JiveController.$inject = ['$state'];

  function JiveController($state){
    let ctrl = this;
    console.log(ctrl);
    ctrl.header = 'JELLO WORLD';

    ctrl.go = function(){
      $state.go('test');
      console.log('asdsadasdasdsd');
    };

  }
})();