(() => {
  'use strict';

  class HTTP{
    /*@ngInject*/
    constructor($http, $q, apiUrl){
      this.$http = $http;
      this.$q = $q;
      this.apiUrl = apiUrl;
    }
    post(url, params){
      let d = this.$q.defer();
      this.$http.post(this.apiUrl+url, params).success(function(resp){
        d.resolve(resp);
      })
      .error(function(resp){
        d.reject(resp);
      });
      return d.promise;
    }
    get(url, params){
      // TODO: cache / retrieve get requests
      let d = this.$q.defer();
      this.$http.get(this.apiUrl+url, params).success(function(resp){
        d.resolve(resp);
      })
      .error(function(resp){
        d.reject(resp);
      });
      return d.promise;
    }
    put(url, params){
      let d = this.$q.defer();
      this.$http.put(this.apiUrl+url, params).success(function(resp){
        d.resolve(resp);
      })
      .error(function(resp){
        d.reject(resp);
      });
      return d.promise;
    }
    delete(url, params){
      let d = this.$q.defer();
      this.$http.delete(this.apiUrl+url, params).success(function(resp){
        d.resolve(resp);
      })
      .error(function(resp){
        d.reject(resp);
      });
      return d.promise;
    }
  }

  HTTP.$inject = ['$http', '$q', 'apiUrl'];

  angular.module('jive')
    .service('HTTP', HTTP);

})();