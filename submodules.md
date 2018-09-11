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
