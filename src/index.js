'use strict';

const fs = require('fs');
const exec = require('child_process').exec;
const ncp = require('ncp').ncp;
const Finder = require('fs-finder');

class JiveAngular{

  constructor(appName){
    this.appName = appName;
    let parts = __filename.split('/');
    this.modulePath = parts.splice(0, parts.length-2).join('/');
    this.nodeModulesPath = this.modulePath + '/node_modules';
    this.templateFilesLocation = this.modulePath + '/template_files';
  }

  getSdkExecutablePath(){
    return Finder.from(this.nodeModulesPath).findFiles('jive-sdk.sh');
  }

  generateAngularTemplate(){
    const appName = this.appName;

    const templateFilesLocation = this.templateFilesLocation;
    const templateFilesDestination = 'apps/' + appName + '/public/';

    console.log('Finding Jive SDK executable...');
    const jsdk = this.getSdkExecutablePath();

    const createJiveAppCommand = jsdk + ' create app --name="' + appName + '"';
    const emptyPublicDirectoryCommand = 'rm -r apps/' + appName + '/public/*';

    fs.mkdir('./' + appName, function(){
      console.log('Directory Created...');
      process.chdir(appName);
      console.log('Changed working directory to ' + appName);

      exec(createJiveAppCommand, function(err){
        if(err){
          console.log(process.cwd());
          console.log(err);
          console.log("Exiting...");
          return;
        }

        console.log('Jive App Generated: ' + appName);

        exec(emptyPublicDirectoryCommand, function(err){
          if(err){
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
        })
      });
    });
  }
}

module.exports = JiveAngular;