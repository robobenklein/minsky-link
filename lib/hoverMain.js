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

module.exports = (cursorListener = {
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

    },

    deactivate () {
      this.subscriptions.dispose();
      this.cursorReturn.destroy();
    },
    serialize () {
      //This shouldn't be needed in the actual plugin.
    }
  });

  //export default cursorListener, this is being changed
//exports.cursorListener = cursorListener;

/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
 /*
let FindAndReplaceUnderCursor;
const {CompositeDisposable} = require('atom');
const {requirePackages}     = require('atom-utils');

module.exports = (FindAndReplaceUnderCursor = {
  subscriptions: null,

  activate(state) {
    // Not the most ideal solution, but this forces the find-and-replace
    // package to activate.
    if (!atom.packages.isPackageActive('find-and-replace')) {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'find-and-replace:toggle');
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'find-and-replace:toggle');
    }

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable;

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {'project-find:search-under-cursor': () => this.searchUnderCursor(true)}));
    return this.subscriptions.add(atom.commands.add('atom-workspace', {'find-and-replace:search-under-cursor': () => this.searchUnderCursor(false)}));
  },

  deactivate() {
    return this.subscriptions.dispose();
  },

  searchUnderCursor(project) {
    return requirePackages('find-and-replace').then((...args) => {
      const [find] = Array.from(args[0]);
      if (!find) { return; }
      const editor  = atom.workspace.getActivePaneItem();
      let pattern = editor != null ? editor.getSelectedText() : undefined;
      if (pattern === "") { pattern = editor != null ? editor.getWordUnderCursor() : undefined; }
      if (!pattern) { return; }

      find.createViews();
      find.findPanel.hide();
      find.projectFindPanel.hide();

      if (project) {
        find.projectFindView.findEditor.setText(pattern);
        return find.projectFindView.search();
      } else {
        find.findView.findEditor.setText(pattern);
        return find.findView.findNext();
      }
    });
  }
});
*/
