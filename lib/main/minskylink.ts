// import {StatusBar} from "atom/status-bar"

//console.log(String("Loading Minsky Link"));

import {CompositeDisposable} from "atom";
//import {FileLocationQuery} from "./atom/utils"

let subscriptions: CompositeDisposable | undefined;
export async function activate() {
  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
  // Register command that toggles this view
  subscriptions = new CompositeDisposable();
  subscriptions.add(atom.commands.add('atom-workspace', {
    'minsky:speaks': () => speaks()
  }));
  //console.log(state)
};

export function deactivate() {
  if (subscriptions) subscriptions.dispose();
};

export function serialize() {
  return undefined
};

export function speaks():void {
  console.log('Minsky was asked to Speak!');
};
