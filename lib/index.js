'use strict';

const Promise = require('promise');
const fsp = require('fs-promise');
const exec = require('child-process-promise').exec;
const ncp = require('ncp').ncp;

class JiveAngular {

  constructor(appName) {
    this.appName = appName;

    let parts = __filename.split('/');
    this.modulePath = parts.splice(0, parts.length - 2).join('/');
    this.nodeModulesPath = this.modulePath + '/node_modules';
    this.jiveSdkPath = this.nodeModulesPath + '/jive-sdk/bin/jive-sdk.sh';
    this.createJiveAppCommand = this.jiveSdkPath + ' create app --name="' + this.appName + '"';
    this.templateFilesLocation = this.modulePath + '/template_files';
    this.templateFilesDestination = 'apps/' + this.appName + '/public/';
    this.emptyPublicDirectoryCommand = 'rm -r apps/' + this.appName + '/public/*';
  }

  makeJiveAppDirectory() {
    return fsp.mkdir('./' + this.appName);
  }

  createJiveApp() {
    return exec(this.createJiveAppCommand);
  }

  emptyPublicDirectory() {
    return exec(this.emptyPublicDirectoryCommand);
  }

  copyTemplateFiles() {
    let self = this;
    return new Promise(function (resolve, reject) {
      ncp(self.templateFilesLocation, self.templateFilesDestination, function (err) {
        if (err) reject(err);else resolve();
      });
    });
  }

  generateAngularTemplate() {
    let self = this;

    return this.makeJiveAppDirectory().then(function () {
      console.log('Directory \'' + self.appName + '\' created...');

      process.chdir(self.appName);
      console.log('Changed working directory to: ' + self.appName);

      console.log('Creating Jive App...');

      return self.createJiveApp();
    }).then(function () {
      console.log('Default app created.');

      console.log('Emptying public directory...');

      return self.emptyPublicDirectory();
    }).then(function () {
      console.log('Copying Angular template files...');

      return self.copyTemplateFiles();
    }).catch(function (err) {
      throw new Error('ERROR: ' + err);
    }).done(function () {
      console.log('Jive App \'' + self.appName + '\' Created!');
    });
  }
}

module.exports = JiveAngular;