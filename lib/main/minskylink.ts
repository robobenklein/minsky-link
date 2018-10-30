import "atom";
import { CompositeDisposable } from "atom";
import { TextEditor } from "atom";
import { DisplayMarker } from "atom";
import { DisplayMarkerLayer } from "atom";

import { test_getComment } from "../github/test";
import { getRepoNames } from "../github/get_names";

var regex1_gh: RegExp = new RegExp(/(GH([0-9]+))/, "gm");

console.log(String("Loading Minsky Link"));

var map_TextEditors_DisplayMarkerLayerIds: {
  [TextEditorID: number]: number;
} = {
  0: 0
};

// Hold all the disposable subscriptions
let subscriptions: CompositeDisposable;
subscriptions = new CompositeDisposable();

// HOVER LISTENER GH40
// TODO

// ISSUE TAG FINDER GH33
// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(
  textToSearch: TextEditor,
  issuetaglayer: DisplayMarkerLayer
) {
  textToSearch.scan(regex1_gh, scanResult => {
    var issue_number: number = parseInt(scanResult.match[2]);
    console.log("Found issue tag: " + scanResult.matchText);
    // check if there already exists a marker on this layer:
    var existing_markers = issuetaglayer.findMarkers({
      intersectsBufferRange: scanResult.range
    });
    for (var marker_to_check of existing_markers) {
      if (marker_to_check.isValid() == true) {
        // still is valid? don't bother
        console.log(
          "Issue tag #" +
            issue_number +
            " already known: " +
            marker_to_check.getBufferRange()
        );
        return;
      } else {
        // destroy the invalid marker:
        marker_to_check.destroy();
      }
    }
    console.log("Creating marker on " + scanResult.range);
    var new_marker = issuetaglayer.markBufferRange(scanResult.range, {
      invalidate: "touch"
    });
    new_marker.setProperties({
      minsky: issue_number
    });
    console.log(
      "Created marker for issue #" +
        issue_number +
        ": " +
        new_marker.getStartBufferPosition
    );
  });

  console.log(
    "issuetaglayer currently has " + issuetaglayer.getMarkerCount() + " items!"
  );
}

// Execute once for every opened editor
atom.workspace.observeTextEditors(editor => {
  console.log("Opening editor: " + editor.getLongTitle());
  console.log("Running scan on " + editor.getLongTitle());

  var issuetaglayer: DisplayMarkerLayer = editor.addMarkerLayer({});
  map_TextEditors_DisplayMarkerLayerIds[editor.id] = parseInt(issuetaglayer.id);
  editor.decorateMarkerLayer(issuetaglayer, {
    type: "highlight",
    class: "minskylink_issue_tag"
  });

  findIssueTags(editor, issuetaglayer);
  subscriptions.add(
    editor.onDidStopChanging(event_editorchanged => {
      // event_editorchanged.changes.forEach(text_change => {
      for (var text_change of event_editorchanged.changes) {
        console.log('Deleted: "' + text_change.oldText + '"');
        console.log('Added: "' + text_change.newText + '"');
        // check if the change range is in any of our issue tags.
        if (
          text_change.newText.length > 0 || // if text was added, we need to rescan
          issuetaglayer.findMarkers({
            intersectsBufferRange: text_change.oldRange
          }).length > 0
        ) {
          // then we should re-scan
          console.log("Re-scanning for issue tags...");
          findIssueTags(editor, issuetaglayer);
          break;
        } else {
          // no need to re-scan
          console.log("No need to re-scan change: " + text_change.oldRange);
        }
      } //);
    })
  );
});

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

subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:testGitHub": () => test_getComment()
  })
);

subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:nameTest": () => {
      const strs = getRepoNames();
      console.log("Org (Outside function) is " + strs[0]);
      console.log("Repo (Outside function) is " + strs[1]);
    }
  })
);

subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:open-issue-tag-from-cursor-position": () =>
      openIssueTagFromCursorPosition()
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
    atom.workspace.addLeftPanel({ item: { tempItem } });
  } else {
    atom.workspace.panelForItem(tempItem)!.show();
  }
}

export function openIssueTagFromCursorPosition(): void {
  var current_editor = atom.workspace.getActiveTextEditor();

  if (current_editor == undefined) {
    console.log("No editor in focus.");
    return;
  }
  if (current_editor.hasMultipleCursors()) {
    console.log("Dunno how to handle hasMultipleCursors!");
    return;
  }

  var current_minsky_marker_layer:
    | DisplayMarkerLayer
    | undefined = current_editor.getMarkerLayer(
    map_TextEditors_DisplayMarkerLayerIds[current_editor.id]
  );
  if (current_minsky_marker_layer == undefined) {
    console.log("Could not retrieve the marker layer!");
    return;
  }

  var current_cursor = current_editor.getLastCursor();

  // var issue_tag_range = current_cursor.getBeginningOfCurrentWordBufferPosition({
  //   wordRegex: regex1_gh,
  //   allowPrevious: true
  // });

  console.log("Current cursor position: " + current_cursor.getBufferPosition());

  var potential_markers: DisplayMarker[] = current_minsky_marker_layer.findMarkers(
    {
      containsBufferPosition: current_cursor.getBufferPosition()
    }
  );

  console.log("Found " + potential_markers.length + " potential_markers");

  var target_marker: DisplayMarker | undefined;

  for (var potential_marker of potential_markers) {
    console.log(
      "potential_marker has properties " +
        Object.keys(potential_marker.getProperties())
    );
    if (potential_marker.getProperties().hasOwnProperty("minsky")) {
      target_marker = potential_marker;
      break;
    }
  }
  if (target_marker == undefined) {
    console.log("No minsky-link markers found under the cursor.");
    return;
  }

  console.log("Found issue under cursor: " + target_marker.getBufferRange());

  var target_properties = target_marker.getProperties() as any;
  console.log("Lookup issue #" + target_properties["minsky"]);

  atom.notifications.addSuccess(
    "Minsky-Link: Loading #" + target_properties["minsky"],
    {
      description:
        "Creating a new pane for issue #" + target_properties["minsky"],
      dismissable: true
    }
  );
  // atom.workspace.open("https://www.google.com/");
}
