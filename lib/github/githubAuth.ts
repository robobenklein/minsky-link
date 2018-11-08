//https://www.npmjs.com/package/@octokit/rest#authentication
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

import * as GitHub from "@octokit/rest";
import * as user from "../git-interface/user";

export class GitHubAuth extends AuthMe {
  //Get auth key.
  var keyinp = readline();

  //Create new user
  var newUser = user();

  GitHub.authenticate({
    type: 'oauth',
    key: newUser,
    secret: keyinp
  })
}
