# How To: Git Submodules

This is a basic tutorial/intro to git submodules. We may add some in the future, so people contributing might need to know about them.

## Using Git Submodules

1. Clone the repo ([https](https://help.github.com/articles/cloning-a-repository/)/[ssh](https://help.github.com/articles/connecting-to-github-with-ssh/))

2. Initiallize the submodule
```
git submodule init --recursive
```
  * The `--recursive` flag initializes any submodules that are in a top-level submodule.

3. Update/clone the submodule
```
git submodule update [--force] [--init] [--recursive]
```
  * `--force`: checks out the submodule using `git clone --force ...`
  * `--init`: initializes any submodules that are not already initialized
  * `--recursive`: runs the update on submodules in a top-level submodule

## Creating a Git Submodule

1. Find the GitHub/GitLab page for the repository that you'll add as a submodule.

2. Copy the https/ssh link from GitHub/GitLab page.

3. Add the submodule to your local repository.
```
git submodule add link [pathname]
```
  * `link` is the GitHub/GitLab clone link from step 2
  * `pathname` is the path to the location where you want to add the submodule.

4. Perform steps 2 and 3 from _Using Git Submodules_.

5. Push `.gitmodules` and the submodule directory to the remote repository

## Creating a Relative Submodule

When you create a submodule using the steps above, you'll find that it will be difficult, if not impossible, for other people to use the submodule. This is especially true if you set up the submodule using https/ssh, and someone is trying to use the submodule using the other protocol.

You can fix this by converting your submodule into a relative submodule. This is done by making the following change to each submodule's entry in the `.gitmodules` file.

```
[submodule "octokit/rest.js]
    path = octokit/rest.js
    url = ~~git@github.com:octokit/rest.js.git~~ ../../octokit/rest.js
```
