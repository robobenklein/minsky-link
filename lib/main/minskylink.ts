// import {StatusBar} from "atom/status-bar"

console.log(String("Loading Minsky Link"))

import {CompositeDisposable} from "atom";

export default {

  subscriptions:CompositeDisposable,
  activate() {

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'my-package:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {},

  toggle():void {
    console.log('MyPackage was toggled!');
  }
};
