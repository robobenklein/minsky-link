//'use babel';
//what is babel? some folks say I need it, some say I don't

  // Extended: Returns the word surrounding the most recently added cursor.
  //
  // * `options` (optional) See {Cursor::getBeginningOfCurrentWordBufferPosition}.
  //getWordUnderCursor (options) {
    //return this.getTextInBufferRange(this.getLastCursor().getCurrentWordBufferRange(options))
  //}

import {CompositeDisposable} from 'atom';

const atom = require("atom");

const cursorListener = {
  subscriptions: null,
  cursorReturn: null,
    activate (state) {
      constructor();
      //this.subscriptions = new Atom.CompositeDisposable();
    },

    constructor() {
      this.editor = editor;
      this.getClient = getClient;
      this.subscriptions = new Atom.CompositeDisposable();
    }

    //Should this be up here?
    this.reinitialize();

    //This should be the main subscription we need.
    //Others can be added into it to get gather other events.
    this.subscriptions.add(atom.texteditor.getWordUnderCursor()) {

console.log("Will this ever work?");
      //This should be the most we need to do.
      var check = atom.texteditor.getWordUnderCursor();

      //Here we should call a function to actually compare the result
      //to our list of issue callsigns eg. "#13" or "Issue 14"

      //Delete this later
      //don't know why this was a var.
      console.log(check);

      //If it passes the check, the actual item to call opening window pane should be
      //here or in the regex function.

      //this.reinitialize();

    },

    deactivate () {
      this.subscriptions.dispose();
      this.cursorReturn.destroy();
    },
    serialize () {
      //This shouldn't be needed in the actual plugin.
    }
  };

  //export default cursorListener;
exports.cursorListener = cursorListener;
