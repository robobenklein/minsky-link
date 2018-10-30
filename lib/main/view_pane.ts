
import "atom";
// import * as github_get_names from "../github/get_names"

//@ts-ignore
import * as etch from "etch";

//@ts-ignore
export class MinskyEtchPane {
  //@ts-ignore
  constructor (props, children) {
    etch.initialize(this);
  }

  getTitle (): String {
    return "Minsky Link Viewer!";
  }

  render () {
    var thing = document.createElement("div");
    thing.innerText = "HelloThere";
    return thing;
  }

  //@ts-ignore
  update (props, children) {
    return etch.update(this);
  }

  async destroy () {
    await etch.destroy(this);
  }
}

export class MinskyEtchPaneView {

  element: HTMLElement;
  uri: String | null;

  // @ts-ignore
  constructor(serializedState ? : any, uri ? : String) {
    this.element = document.createElement('div');
    this.uri = uri ? uri : "minsky://minsky-link";
    this.element.innerHTML = "Hello Minsky!<br>My URI is " + uri;
  }
  getTitle() {
    return "Minsky Link Something";
  }
  getURI() {
    return this.uri;
  }

  serialize() {
    return {
      deserializer: "minsky-link/MinskyEtchPaneView"
    };
  }
  destroy() {
    this.element.remove();
  }
  getElement() {
    return this.element;
  }
}

atom.workspace.addOpener(uri => {
  console.log("Opener checking URI \"" + uri + "\"");
  if (uri.startsWith("minsky://")) {
    return new MinskyEtchPaneView(null, uri);
  }
});
