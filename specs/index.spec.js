var chai = require('chai');
chai.use(require('chai-fs'));
var expect = require('chai').expect;
var exec = require('child_process').exec;
var JiveAngular = require('../lib/index');
var FS = require('fs-mock');

describe('JiveAngular', function(){

  beforeEach(function(){
    this.appName = 'DELETEME';

    this.cleanup = function(){
      exec('rm -rf ' + this.appName, function(){
        console.log('Removed ' + this.appName);
      });
    }

    this.jang = new JiveAngular(this.appName);
  });

  it('instantiating the object should yield class of type JiveAngular', function(){
    expect(this.jang).to.be.instanceof(JiveAngular);
  });

  describe('#generateAngularTemplate', function(){

    it('should create the Jive app', function(){
      this.jang.generateAngularTemplate();
      expect(this.appName).to.be.a.directory();
    });

  });


});