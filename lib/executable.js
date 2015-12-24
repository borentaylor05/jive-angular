#! /usr/bin/env node


'use strict';

var JiveAngular = require('./index.js');

if (process.argv.length === 3) {
  var jiveAng = new JiveAngular(process.argv[2]);
  jiveAng.generateAngularTemplate();
} else {
  console.log('Wrong number of arguments.');
  console.log('Example Usage: node make_jive_angular.js AppName');
}