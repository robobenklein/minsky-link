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

/*
var GitHubApi = require("github");
var github = new GitHubApi({
    version: "3.0.0"
});
github.authenticate({
  type: "basic",
  username: 'YOUR USERNAME',
  password: 'YOUR PASSWORD'
});
github.oauth.createAuthorization(
  { scopes:['repo'],
    note:'Some message to remind you'
  }
, function(e,d) {
    console.log("error: " + e, "token: " + d.token);
  }
);
*/

import * as GitHub from "@octokit/rest";
import * as user from "../git-interface/user";

const var CLID = "";

export class GitHubAuth extends AuthMe {
  //Get auth key.
  //var keyinp = readline();

  //Create new user
  //var newUser = user();

  GitHub.authorization.create();
  /*({
    type: 'oauth',
    key: newUser,
    secret: keyinp
  })*/
}
