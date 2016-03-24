var EventEmitter = require('events');
var util = require('util');
var readline = require('readline');
var OAuth2 = require('../index').OAuth2;

// OAuth2 Configuration
var clientId = '';
var clientSecret = '';

var baseSiteUrl = 'https://universe.com/';
var authorizePath = 'oauth/authorize';
var accessTokenPath = 'oauth/token';
var customHeaders = null;

var oauth2 = new OAuth2(
  clientId, clientSecret, baseSiteUrl, authorizePath, accessTokenPath, customHeaders
);

function UniverseEmitter() {
  EventEmitter.call(this);
}
util.inherits(UniverseEmitter, EventEmitter);

var emitter = new UniverseEmitter();

emitter.on('init', function() {
  var self = this;
  //loadAccessToken();
  var interface = readline.createInterface(process.stdin, process.stdout, null);

  self.on('exit', function() {
    interface.close();
    process.stdin.destroy();
  });

  interface.question('Enter your authorization code: ', function(answer) {
    self.emit('auth code', answer);
  });
});

emitter.on('auth code', function(authCode) {
  var self = this;
  var authParams = {
    grant_type: 'authorization_code',
    redirect_uri: 'urn:ietf:wg:oauth:2.0:oob'
  };
  oauth2.getOAuthAccessToken(authCode, authParams, function(err, accessToken, refreshToken, results) {
    if (err) {
      self.emit('error', err.data);
    } else {
      self.emit('access token', accessToken);
    }
  });
});

emitter.on('access token', function(accessToken) {
  // saveAccessToken(accessToken);
  printListings(accessToken, function(err) {
    if (err) {
      this.emit('error', err);
    }
    this.emit('exit');
  });
});

emitter.on('error', function(error) {
  console.log('Error: ' + error);
});

function loadAccessToken() {
}

function printListings(accessToken) {
  var userId = '';
  var url = baseSiteUrl + 'api/v2/listings?user_id=' + userId;
  oauth2.get(url, accessToken, function(err, accessToken, refreshToken, results) {
    if (err) {
      console.log('Error: ' + err.data);
    } else {
      console.dir(results);
      console.log('Results: ' + results);
    }
  });
}

emitter.emit('init');
