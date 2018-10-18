import {CompositeDisposable} from "atom";

let subscriptions: CompositeDisposable | undefined;

export async function activate() {
  // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
  subscriptions = new CompositeDisposable();

  // This adds the Active Command to our list of commands in Atom
  subscriptions.add(atom.commands.add('atom-workspace', {
    'minsky:speaks': () => speaks()
  }));
};

// For when Atom closes, this is what to do.
export function deactivate() {
  if (subscriptions) subscriptions.dispose();
};

export function serialize() {
  return undefined
};

// This is an active command function. You can add more in the
// activate function.
export function speaks():void {
  console.log('Minsky was asked to Speak!');
};
