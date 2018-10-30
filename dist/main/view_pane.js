"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
//@ts-ignore
const etch = require("etch");
class MinskyEtchPane {
    //@ts-ignore
    constructor(props, children) {
        etch.initialize(this);
    }
    getTitle() {
        return "Minsky Link Viewer!";
    }
    render() {
        var thing = document.createElement("div");
        thing.innerText = "HelloThere";
        return thing;
    }
    //@ts-ignore
    update(props, children) {
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
    }
}
exports.MinskyEtchPane = MinskyEtchPane;
class MinskyEtchPaneView {
    //@ts-ignore
    constructor(serializedState) {
        this.element = document.createElement('div');
    }
    getTitle() {
        return "Minsky Link Something";
    }
    getURI() {
        "atom://minsky-link";
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
exports.MinskyEtchPaneView = MinskyEtchPaneView;
atom.workspace.addOpener(uri => {
    if (uri == "atom://minsky-link") {
        return new MinskyEtchPaneView();
    }
});
//# sourceMappingURL=view_pane.js.map