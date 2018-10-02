'use babel';

  // Extended: Returns the word surrounding the most recently added cursor.
  //
  // * `options` (optional) See {Cursor::getBeginningOfCurrentWordBufferPosition}.
  //getWordUnderCursor (options) {
    //return this.getTextInBufferRange(this.getLastCursor().getCurrentWordBufferRange(options))
  //}

 import {CompositeDisposable} from 'atom';

  const cursorListener = {
  subscriptions: null,
  cursorReturn: null,
    activate (state) {
      this.subscriptions = new CompositeDisposable();
    },
    this.subscriptions.add(atom.texteditor.getWordUnderCursor) {

    }
    deactivate () {
      this.subscriptions.dispose();
      this.cursorReturn.destroy();
    },
    serialize () {
    }
  };

  export default YourPackage;
