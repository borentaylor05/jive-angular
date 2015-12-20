/*eslint-disable no-console*/
var colors = require('colors');
var config = require('config');

var express = require('express');
var auth = require('basic-auth');

var app = express();
app.use(express.static('dist'));

if(process.env.BASIC_AUTH){
  app.use(function(req, res, next) {
    var user = auth(req);

    if (!req.url.match(/\/heartbeat.*/) && (user === undefined || user['name'] !== config.username || user['pass'] !== config.password)) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Basic realm="Member Central"');
      res.end('Unauthorized');
    } else {
      next();
    }
  });
}

app.listen(config.port, function() {
  console.log('Server is running on port: ', config.port);
});

var serverAlive = true;
app.get('/heartbeat', function(req, res) {
  if (serverAlive) {
    res.json({ alive: true });
  } else {
    res.status(503).json({ shuttingDown: true })
  }
});

app.get('/', function(req, res) {
  res.sendFile('dist/index.html');
});