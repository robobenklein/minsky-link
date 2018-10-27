import "atom";
import { CompositeDisposable } from "atom";
import { TextEditor } from "atom";
import { ViewRegisty } from "atom";
//import { Workspace } from "atom";

console.log(String("Loading Minsky Link"));

// HOVER LISTENER GH40

// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch: TextEditor) {
  var regex1 = new RegExp(/(GH([0-9]+))/);
  textToSearch.scan(regex1, scanResult => {
    var issue_number: number = parseInt(scanResult.match[2]);
    console.log("Found issue tag: " + scanResult.matchText);
    console.log("Creating marker on " + scanResult.range);
    var new_marker = textToSearch.markBufferRange(scanResult.range, {
      invalidate: "touch"
    });
    console.log(
      "Created marker for issue #" +
        issue_number +
        ": " +
        new_marker.getStartBufferPosition
    );
    var new_decoration = textToSearch.decorateMarker(new_marker, {
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
subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:inPane": () => inpaneses("http://www.belk.com")
  })
);
subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:newLeftPane": () => nlpaneses("blanks")
  })
);

// This is an active command function. You can add more in the
// activate function.
export function speaks(): void {
  console.log("Minsky was asked to Speak!");
}

export function inpaneses(x: string): void {
  //console.log(atom.workspace.getActivePaneItem());
  // First off atom.workspace is the global variable for the
  // current Atom workspace.
  atom.workspace.open(x);
  // Open is a function that will do many things based on the
  // URI. First, it checks to see if the URI is already open
  // it will make it the active item.
  // The last thing it does is try to open the URI. If it
  // can't, it creates a new TextEditor object with the URI
  // name.
  // Details on options for this function and defualts are in
  // https://atom.io/docs/api/v1.31.2/Workspace
}
export function nlpaneses(x: string): void {
  let tempItem = atom.workspace.createItemForURI(x);
  if (atom.workspace.panelForItem(tempItem) == null) {
    //let tempOptions = { item:{tempItem} };
    //atom.views.addViewProvider tempItem, (TextEditor) ->
      //textEditorElement = new TextEditorElement
      //textEditorElement.initialize(tempItem)
      //textEditorElement
    atom.workspace.addLeftPanel( { item:{tempItem} } );
  } else {
    atom.workspace.panelForItem(tempItem)!.show();
  }
}
