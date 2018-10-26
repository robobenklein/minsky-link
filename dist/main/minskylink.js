"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const test_1 = require("../github/test");
//import {MenuManager} from "atom";
let subscriptions;
async function activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    subscriptions = new atom_1.CompositeDisposable();
    // This adds the Active Command to our list of commands in Atom
    subscriptions.add(atom.commands.add("atom-workspace", {
        "minsky:speaks": () => speaks()
    }));
    subscriptions.add(atom.commands.add("atom-workspace", {
        "minksy:testComment": () => test_1.test_getComment()
    }));
}
exports.activate = activate;
// For when Atom closes, this is what to do.
function deactivate() {
    if (subscriptions)
        subscriptions.dispose();
}
exports.deactivate = deactivate;
function serialize() {
    return undefined;
}
exports.serialize = serialize;
// This is an active command function. You can add more in the
// activate function.
function speaks() {
    console.log("Minsky was asked to Speak!");
}
exports.speaks = speaks;
//# sourceMappingURL=minskylink.js.map