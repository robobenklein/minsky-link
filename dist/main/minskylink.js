"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
const atom_1 = require("atom");
const test_1 = require("../github/test");
//@ts-ignore
require("./view_pane");
var regex1_gh = new RegExp(/(GH([0-9]+))/, "gm");
console.log(String("Loading Minsky Link"));
var map_TextEditors_DisplayMarkerLayerIds = {
    0: 0
};
// Hold all the disposable subscriptions
let subscriptions;
subscriptions = new atom_1.CompositeDisposable();
// HOVER LISTENER GH40
// TODO
// ISSUE TAG FINDER GH33
// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch, issuetaglayer) {
    textToSearch.scan(regex1_gh, scanResult => {
        var issue_number = parseInt(scanResult.match[2]);
        console.log("Found issue tag: " + scanResult.matchText);
        // check if there already exists a marker on this layer:
        var existing_markers = issuetaglayer.findMarkers({
            intersectsBufferRange: scanResult.range
        });
        for (var marker_to_check of existing_markers) {
            if (marker_to_check.isValid() == true) {
                // still is valid? don't bother
                console.log("Issue tag #" +
                    issue_number +
                    " already known: " +
                    marker_to_check.getBufferRange());
                return;
            }
            else {
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
subscriptions.add(atom.commands.add("atom-workspace", {
    "minsky:speaks": () => speaks()
}));
subscriptions.add(atom.commands.add("atom-workspace", {
    "minsky:testGitHub": () => test_1.test_getComment()
}));
// This is an active command function. You can add more in the
// activate function.
function speaks() {
    console.log("Minsky was asked to Speak!");
}
exports.speaks = speaks;
subscriptions.add(atom.commands.add("atom-workspace", {
    "minsky:open-issue-tag-from-cursor-position": () => openIssueTagFromCursorPosition()
}));
function openIssueTagFromCursorPosition() {
    var current_editor = atom.workspace.getActiveTextEditor();
    if (current_editor == undefined) {
        console.log("No editor in focus.");
        return;
    }
    if (current_editor.hasMultipleCursors()) {
        console.log("Dunno how to handle hasMultipleCursors!");
        return;
    }
    var current_minsky_marker_layer = current_editor.getMarkerLayer(map_TextEditors_DisplayMarkerLayerIds[current_editor.id]);
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
        return;
    }
    console.log("Found issue under cursor: " + target_marker.getBufferRange());
    var target_properties = target_marker.getProperties();
    console.log("Lookup issue #" + target_properties["minsky"]);
    atom.notifications.addSuccess("Minsky-Link: Loading #" + target_properties["minsky"], {
        description: "Creating a new pane for issue #" + target_properties["minsky"],
        dismissable: true
    });
    // working on GH62
    // atom.workspace.open("https://www.google.com/");
    atom.workspace.open("minsky://" + target_properties["minsky"], {
        split: "down",
        searchAllPanes: true
    });
    console.log("End of openIssueTagFromCursorPosition.");
}
exports.openIssueTagFromCursorPosition = openIssueTagFromCursorPosition;
//# sourceMappingURL=minskylink.js.map