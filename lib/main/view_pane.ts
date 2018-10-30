
import "atom";

//@ts-ignore
import * as etch from "etch";

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

  //@ts-ignore
  constructor(serializedState ?) {
    this.element = document.createElement('div');

  }
  getTitle() {
    return "Minsky Link Something";
  }
  getURI() {
    "atom://minsky-link"
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
  if (uri == "atom://minsky-link") {
    return new MinskyEtchPaneView();
  }
});
