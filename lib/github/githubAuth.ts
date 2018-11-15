//https://www.npmjs.com/package/@octokit/rest#authentication
//https://github.com/octokit/rest.js/blob/master/examples/addCollaborator.js
/*
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
*/

import GitHub from "@octokit/rest";
import user from "../git-interface/user";
import Token from "getToken"

var CLID = Token.TokenMe();

export class GitHubAuth extends AuthMe {
  //Get auth key.

  //Create new user
  //Does not seem necessary.
  //var newUser = user();

  GitHub.authenticate({
    type: 'oauth',
    token: CLID
    //secret: keyinp
  })
}
