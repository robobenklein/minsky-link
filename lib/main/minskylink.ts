import 'atom';
import {TextBuffer} from 'atom';

console.log(String("Loading Minsky Link"));

// HOVER LISTENER GH40

// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch: TextBuffer) {
  var regex1 = new RegExp( /( GH([0-9]+))/ );
  textToSearch.scan(regex1, (scanResult) => {
    console.log("Found issue tag: " + scanResult.matchText);
  });
}

// const subscriptions = new CompositeDisposable();

atom.workspace.observeTextEditors(editor => {
  console.log("Opening editor: " + editor.getLongTitle());
  console.log("Running scan on " + editor.getLongTitle());
  findIssueTags(editor.getBuffer());

  // TODO place hook on the buffer being edited:
});
