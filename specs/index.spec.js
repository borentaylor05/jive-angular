var chai = require('chai');
var expect = require('chai').expect;

var fs = require('fs');
var exec = require('child_process').exec;

var JiveAngular = require('../lib/index');
var helper = require('./helper');


describe('JiveAngular', function(){

  beforeEach(function(){
    this.appName = 'DELETEME';
    this.defaultJiveJavascriptsDirectory = 'apps/' + this.appName + '/public/javascripts';
    this.angularAppDistDirectory = 'apps/' + this.appName + '/public/dist';

    this.cleanup = function(){
      exec('rm -rf ' + this.appName);
    };

  });

  describe('when instantiated', function(){

    beforeEach(function(){
      this.jang = new JiveAngular(this.appName);
    });

    it(' class of type JiveAngular', function(){
      expect(this.jang).to.be.instanceof(JiveAngular);
    });

    describe('file system actions', function(){

      afterEach(function(){
        this.cleanup();
      });

      describe('#makeJiveAppDirectory', function(){

        afterEach(function(){
          this.cleanup();
        });

        it('should create a directory with the app name', function(){
          var self = this;

          return this.jang.makeJiveAppDirectory(function(){
            expect(helper.dirExists(self.appName)).to.eq(true);
          });
        });

      });

      describe('all functions', function(){

        afterEach(function(){
          this.cleanup();
          process.chdir('..');
        });

        it('creates a Jive app with an angular project in the public directory', function(){
          var self = this;

          return this.jang.makeJiveAppDirectory().then(function(){
            process.chdir(self.appName);
            return self.jang.createJiveApp();
          })
          .then(function(){
            expect(helper.dirExists('apps')).to.eq(true);
            expect(helper.dirExists(self.defaultJiveJavascriptsDirectory)).to.eq(true);

            return self.jang.emptyPublicDirectory();
          })
          .then(function(){
            expect(function() {
              helper.dirExists(self.defaultJiveJavascriptsDirectory);
            }).to.throw(Error);

            expect(function() {
              helper.dirExists(self.angularAppDistDirectory);
            }).to.throw(Error);

            return self.jang.copyTemplateFiles();
          })
          .then(function(){
            expect(helper.dirExists(self.angularAppDistDirectory)).to.eq(true);
          });
        });

      });

    });



  });

});