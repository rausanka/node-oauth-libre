var OAuth = require('../index').OAuth;

// Setting up the OAuth client
var requestUrl = 'https://api.twitter.com/oauth/request_token';
var accessUrl = 'https://api.twitter.com/oauth/access_token';
var version = '1.0';
var authorizeCallback = 'oob';
var signatureMethod = 'HMAC-SHA1';
var nonceSize = null;
var customHeaders = null;

// Go to https://dev.twitter.com/oauth/overview/application-owner-access-tokens
// to fill these in:
var consumerKey = '';
var consumerSecret = '';

var client = new OAuth(
  requestUrl, accessUrl,
  consumerKey, consumerSecret,
  version,
  authorizeCallback,
  signatureMethod,
  nonceSize,
  customHeaders
);

// Making a request to the API
var url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';

// Go to https://dev.twitter.com/oauth/overview/application-owner-access-tokens
// to fill these in:
var accessToken = '';
var accessTokenSecret = '';

client.get(url, accessToken, accessTokenSecret, function(err, data, response) {
  if (err) {
    console.log('Error: ' + error);
  } else {
    console.log('Data: ' + data);
    console.log('Response: ' + response);
  }
});
