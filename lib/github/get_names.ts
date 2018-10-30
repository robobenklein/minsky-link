import "atom";

export function getRepoNames(): string[] {
  const editor = atom.workspace.getActivePaneItem() as any;
  if (editor == undefined) {
    return ["", ""];
  }
  const file = editor.buffer.file;
  if (file == undefined) {
    return ["", ""];
  }
  const fname = file.path;
  console.log("File name is " + fname);
  const repos = atom.project.getRepositories();
  var currrepo: any;
  for (const repo of repos) {
    if (repo.getReferences(fname) != undefined) {
      currrepo = repo;
      break;
    }
  }
  const url = currrepo.getOriginURL();
  const ind = url.indexOf(":");
  const slash = url.indexOf("/", ind);
  const dotgit = url.indexOf(".git", slash);
  const org = url.substring(ind + 1, slash);
  const repo = url.substring(slash + 1, dotgit);
  console.log("Org is " + org);
  console.log("Repo is " + repo);
  return [org, repo];
}
