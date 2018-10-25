import "atom";
import { CompositeDisposable } from "atom";
import { TextEditor } from "atom";

console.log(String("Loading Minsky Link"));

// HOVER LISTENER GH40

// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch: TextEditor) {
  var regex1 = new RegExp(/( GH([0-9]+))/);
  textToSearch.scan(regex1, scanResult => {
    var issue_number: number = parseInt(scanResult.match[2]);
    console.log("Found issue tag: " + scanResult.matchText);
    console.log("Creating marker on " + scanResult.range);
    var new_marker = textToSearch.markBufferRange(scanResult.range, {
      invalidate: 'touch'
    });
    console.log("Created marker for issue #" + issue_number + ": " + new_marker.getStartBufferPosition);
    var new_decoration =  textToSearch.decorateMarker(new_marker, {
      type: "highlight",
      class: "minskylink_issue_tag"
    });
    console.log("Decorated #" + issue_number + " with " + new_decoration);
  });
}

atom.workspace.observeTextEditors(editor => {
  console.log("Opening editor: " + editor.getLongTitle());
  console.log("Running scan on " + editor.getLongTitle());
  findIssueTags(editor);

  // TODO place hook on the buffer being edited:
  editor.onDidStopChanging(event_editorchanged => {
    event_editorchanged.changes.forEach(text_change => {
      // check if the change range is in any of our issue tags.
      console.log("Changed text: " + text_change.oldRange);
    });
    findIssueTags(editor);
  });
});

let subscriptions: CompositeDisposable | undefined;

subscriptions = new CompositeDisposable();

  // This adds the Active Command to our list of commands in Atom
subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:speaks": () => speaks()
  })
);

// This is an active command function. You can add more in the
// activate function.
export function speaks(): void {
  console.log("Minsky was asked to Speak!");
}
