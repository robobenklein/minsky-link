"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
const atom_1 = require("atom");
// import { test_getComment } from "../github/test";
const get_names_1 = require("../github/get_names");
//@ts-ignore
// import "./view_pane";
//@ts-ignore
// import { GithubPackage } from "github";
// this is for #69!
var regex1_gh = new RegExp(atom.config.get("minsky-link.issue_tag_regex"), "gm");
atom.config.onDidChange("minsky-link.issue_tag_regex", ({ newValue, oldValue }) => {
    console.log("Regex tag changed from " + oldValue + " to " + newValue);
    // changes the internal regex but does not rescan changes
    regex1_gh = new RegExp(newValue, "gm");
});
console.log(String("Loading Minsky Link"));
//@ts-ignore
// console.log("GithubPackage repo: " + GithubPackage.getActiveRepository());
var map_TextEditors_DisplayMarkerLayerIds = {
    0: 0
};
// Hold all the disposable subscriptions
let subscriptions;
subscriptions = new atom_1.CompositeDisposable();
// HOVER LISTENER GH40
// TODO #40
// ISSUE TAG FINDER GH33
// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch, issuetaglayer) {
    textToSearch.scan(regex1_gh, scanResult => {
        var issue_number = parseInt(scanResult.match[1]);
        // console.log("Found issue tag: " + scanResult.matchText);
        // check if there already exists a marker on this layer:
        var existing_markers = issuetaglayer.findMarkers({
            intersectsBufferRange: scanResult.range
        });
        for (var marker_to_check of existing_markers) {
            if (marker_to_check.isValid() == true) {
                // still is valid? don't bother
                // console.log(
                //   "Issue tag #" +
                //     issue_number +
                //     " already known: " +
                //     marker_to_check.getBufferRange()
                // );
                return;
            }
            else {
                // destroy the invalid marker:
                marker_to_check.destroy();
            }
        }
        // console.log("Creating marker on " + scanResult.range);
        var new_marker = issuetaglayer.markBufferRange(scanResult.range, {
            invalidate: "touch"
        });
        new_marker.setProperties({
            minsky: issue_number
        });
        console.log("Created marker for issue #" +
            issue_number +
            ": " +
            new_marker.getStartBufferPosition);
    });
    console.log("issuetaglayer currently has " + issuetaglayer.getMarkerCount() + " items!");
}
// Execute once for every opened editor
atom.workspace.observeTextEditors(editor => {
    console.log("Opening editor: " + editor.getLongTitle());
    console.log("Running scan on " + editor.getLongTitle());
    var issuetaglayer = editor.addMarkerLayer({});
    map_TextEditors_DisplayMarkerLayerIds[editor.id] = parseInt(issuetaglayer.id);
    editor.decorateMarkerLayer(issuetaglayer, {
        type: "highlight",
        class: "minskylink_issue_tag"
    });
    findIssueTags(editor, issuetaglayer);
    subscriptions.add(editor.onDidStopChanging(event_editorchanged => {
        // event_editorchanged.changes.forEach(text_change => {
        for (var text_change of event_editorchanged.changes) {
            console.log('Deleted: "' + text_change.oldText + '"');
            console.log('Added: "' + text_change.newText + '"');
            // check if the change range is in any of our issue tags.
            if (text_change.newText.length > 0 || // if text was added, we need to rescan
                issuetaglayer.findMarkers({
                    intersectsBufferRange: text_change.oldRange
                }).length > 0) {
                // then we should re-scan
                console.log("Re-scanning for issue tags...");
                findIssueTags(editor, issuetaglayer);
                break;
            }
            else {
                // no need to re-scan
                console.log("No need to re-scan change: " + text_change.oldRange);
            }
        } //);
    }));
});
// This adds the Active Command to our list of commands in Atom
// subscriptions.add(
//   atom.commands.add("atom-workspace", {
//     "minsky:speaks": () => speaks()
//   })
// );
// subscriptions.add(
//   atom.commands.add("atom-workspace", {
//     "minsky:testGitHub": () => test_getComment()
//   })
// );
// This is an active command function. You can add more in the
// activate function.
function speaks() {
    console.log("Minsky was asked to Speak!");
}
exports.speaks = speaks;
/*
subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:open-issue-tag-from-cursor-position": () =>
      openIssueTagFromCursorPosition()
  })
);

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
      description: "Opening pane for issue #" + target_properties["minsky"],
      dismissable: true
    }
  );

  // working on GH62
  // atom.workspace.open("https://www.google.com/");
  atom.workspace.open("minsky://" + target_properties["minsky"], {
    split: "down",
    searchAllPanes: true
  });

  console.log("End of openIssueTagFromCursorPosition.");
}
//*/
/*
 * GithubPackage hijack
 */
//*
subscriptions.add(atom.commands.add("atom-workspace", {
    "minsky:open-issue-tag-from-cursor-position": () => openIssueishFromCursorPosition()
}));
// added with GH91
atom.contextMenu.add({
    "atom-text-editor": [
        {
            label: "Minsky Link",
            // submenu: [
            //   {
            //     label: "Open Issue",
            command: "minsky:open-issue-tag-from-cursor-position"
            //   }
            // ]
        }
    ]
});
function openIssueishFromCursorPosition() {
    var current_editor = atom.workspace.getActiveTextEditor();
    if (current_editor == undefined) {
        console.log("No editor in focus.");
        atom.notifications.addError("Minsky Link: No editor in focus!", {
            description: "Please focus a text editor pane and tag, then try again.",
            dismissable: true
        });
        return;
    }
    if (current_editor.hasMultipleCursors()) {
        console.log("Dunno how to handle hasMultipleCursors!");
        atom.notifications.addError("Minsky Link cannot handle multiple cursors!", {
            description: "This may later be implemented.",
            dismissable: true
        });
        return;
    }
    var current_minsky_marker_layer = current_editor.getMarkerLayer(map_TextEditors_DisplayMarkerLayerIds[current_editor.id]);
    if (current_minsky_marker_layer == undefined) {
        console.log("Could not retrieve the marker layer!");
        atom.notifications.addFatalError("Minsky Link encountered an unknown error.", {
            description: "Error: undefined current_minsky_marker_layer",
            dismissable: true
        });
        return;
    }
    var current_cursor = current_editor.getLastCursor();
    console.log("Current cursor position: " + current_cursor.getBufferPosition());
    var potential_markers = current_minsky_marker_layer.findMarkers({
        containsBufferPosition: current_cursor.getBufferPosition()
    });
    console.log("Found " + potential_markers.length + " potential_markers");
    var target_marker;
    for (var potential_marker of potential_markers) {
        console.log("potential_marker has properties " +
            Object.keys(potential_marker.getProperties()));
        if (potential_marker.getProperties().hasOwnProperty("minsky")) {
            target_marker = potential_marker;
            break;
        }
    }
    if (target_marker == undefined) {
        console.log("No minsky-link markers found under the cursor.");
        atom.notifications.addWarning("Couldn't parse tag.", {
            detail: "Please place the text cursor on the issue tag and try again.\n\
You may need to change the Issue Tag Regex in the plugin settings if your tags are not being recognized.",
            dismissable: false
        });
        return;
    }
    console.log("Found issue under cursor: " + target_marker.getBufferRange());
    var target_properties = target_marker.getProperties();
    console.log("Lookup issue #" + target_properties["minsky"]);
    var loading_notif = atom.notifications.addSuccess("Minsky-Link: Loading Issue #" + target_properties["minsky"], {
        description: "Opening pane for issue #" + target_properties["minsky"],
        dismissable: false // will disappear on it's own
    });
    // XXX new idea: hijack github views
    // for now since GH84 is in the way, let's just assume it's here
    var reposlug = get_names_1.getRepoNames();
    var current_repo = atom.project.getRepositories()[0];
    var git_workdir = current_repo.getWorkingDirectory();
    var new_uri_to_open = "atom-github://issueish/" +
        encodeURIComponent("https://api.github.com") +
        "/" +
        reposlug[0] +
        "/" +
        reposlug[1] +
        "/" +
        target_properties["minsky"] +
        "?workdir=" +
        encodeURIComponent(git_workdir);
    var pane_promise = atom.workspace.open(new_uri_to_open, {
        split: atom.config.get("minsky-link.pane_options.viewmode_panes_direction"),
        pending: true,
        searchAllPanes: true
    });
    pane_promise.catch(reason => {
        loading_notif.dismiss();
        atom.notifications.addError("Failed to open URI", {
            description: "Minsky Link caught an error when opening " +
                new_uri_to_open +
                " with error " +
                reason,
            dismissable: true
        });
    });
    console.log("End of openIssueishFromCursorPosition.");
}
exports.openIssueishFromCursorPosition = openIssueishFromCursorPosition;
//*/
//# sourceMappingURL=minskylink.js.map