var Q = require('q');
var fs = require('fs');

module.exports = {
  promise: function(toResolve){
    var deferred = Q.defer();
    deferred.resolve(toResolve);
    return deferred.promise;
  },
  dirExists: function(dir){
    return fs.statSync(dir).isDirectory()
  }
};