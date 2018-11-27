exports.githubAuth = githubAuth;

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
