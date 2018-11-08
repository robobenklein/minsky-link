//https://www.npmjs.com/package/@octokit/rest#authentication
"use strict";
const GitHub = require('@octokit/rest');
const user = require("../git-interface/user");

//Will fix later. 
class githubAuth {
  //GitHub.authenticate('oauth', process.)
  var keyinp = readline();

  var newUser = user.User();

  GitHub.authenticate({
  type: 'oauth',
  key: newUser,
  secret: keyinp
  })

}

exports.githubAuth = githubAuth;
