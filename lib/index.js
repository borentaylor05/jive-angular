'use strict';

const fs = require('fs');
const exec = require('child_process').exec;
const ncp = require('ncp').ncp;
const Finder = require('fs-finder');

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

  generateAngularTemplate() {
    const appName = this.appName;
    const createJiveAppCommand = this.createJiveAppCommand;
    const templateFilesLocation = this.templateFilesLocation;
    const templateFilesDestination = this.templateFilesDestination;
    const emptyPublicDirectoryCommand = this.emptyPublicDirectoryCommand;

    fs.mkdir('./' + appName, function () {
      console.log('Directory Created...');
      process.chdir(appName);
      console.log('Changed working directory to ' + appName);

      exec(createJiveAppCommand, function (err) {
        if (err) {
          console.log(process.cwd());
          console.log(err);
          console.log("Exiting...");
          return;
        }

        console.log('Jive App Generated: ' + appName);

        exec(emptyPublicDirectoryCommand, function (err) {
          if (err) {
            console.log(err);
            console.log("Exiting...");
            return;
          }

          console.log('Emptied public directory...');

          ncp(templateFilesLocation, templateFilesDestination, function (err) {
            if (err) {
              return console.error(err);
            }

            console.log('Template Populated for Jive App: ' + appName);
          });
        });
      });
    });
  }
}

module.exports = JiveAngular;