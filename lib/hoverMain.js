//'use babel';
//what is babel? some folks say I need it, some say I don't

  // Extended: Returns the word surrounding the most recently added cursor.
  //
  // * `options` (optional) See {Cursor::getBeginningOfCurrentWordBufferPosition}.
  //getWordUnderCursor (options) {
    //return this.getTextInBufferRange(this.getLastCursor().getCurrentWordBufferRange(options))
  //}



  //This looks promising, you can hover over a regex, eg "#5" and this
  //will catch that and show it.

 import {CompositeDisposable} from 'atom';

  const cursorListener = {
  subscriptions: null,
  cursorReturn: null,
    activate (state) {
      this.subscriptions = new CompositeDisposable();
    },
    this.subscriptions.add(atom.texteditor.getWordUnderCursor) {
      //add something here but unsure what that should be.
    },

    deactivate () {
      this.subscriptions.dispose();
      this.cursorReturn.destroy();
    },
    serialize () {
      //I don't honestly know what this should be doing.
    }
  };

  export default cursorListener;
