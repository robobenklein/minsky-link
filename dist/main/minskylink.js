"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
const atom_1 = require("atom");
console.log(String("Loading Minsky Link"));
// HOVER LISTENER GH40
// ISSUE TAG FINDER GH33
// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch, issuetaglayer) {
    var regex1 = new RegExp(/(GH([0-9]+))/, "gm");
    textToSearch.scan(regex1, scanResult => {
        var issue_number = parseInt(scanResult.match[2]);
        console.log("Found issue tag: " + scanResult.matchText);
        // check if there already exists a marker on this layer:
        var existing_markers = issuetaglayer.findMarkers({
            intersectsBufferRange: scanResult.range
        });
        for (var i = 0; i < existing_markers.length; i++) {
            if (existing_markers[i].isValid() == true) {
                // still is valid? don't bother
                console.log("Issue tag #" + issue_number + " already known: " + existing_markers[i].getBufferRange());
                return;
            }
            else {
                // destroy the invalid marker:
                existing_markers[i].destroy();
            }
        }
        console.log("Creating marker on " + scanResult.range);
        var new_marker = issuetaglayer.markBufferRange(scanResult.range, {
            invalidate: "touch"
        });
        console.log("Created marker for issue #" +
            issue_number +
            ": " +
            new_marker.getStartBufferPosition);
        var new_decoration = textToSearch.decorateMarker(new_marker, {
            type: "highlight",
            class: "minskylink_issue_tag"
        });
        console.log("Decorated #" + issue_number + " with " + new_decoration);
    });
    console.log("issuetaglayer currently has " + issuetaglayer.getMarkerCount() + " items!");
}
atom.workspace.observeTextEditors(editor => {
    console.log("Opening editor: " + editor.getLongTitle());
    console.log("Running scan on " + editor.getLongTitle());
    var issuetaglayer = editor.addMarkerLayer({});
    findIssueTags(editor, issuetaglayer);
    // TODO place hook on the buffer being edited:
    editor.onDidStopChanging(event_editorchanged => {
        event_editorchanged.changes.forEach(text_change => {
            // check if the change range is in any of our issue tags.
            console.log("Changed text: " + text_change.oldRange);
        });
        findIssueTags(editor, issuetaglayer);
    });
});
let subscriptions;
subscriptions = new atom_1.CompositeDisposable();
// This adds the Active Command to our list of commands in Atom
subscriptions.add(atom.commands.add("atom-workspace", {
    "minsky:speaks": () => speaks()
}));
// This is an active command function. You can add more in the
// activate function.
function speaks() {
    console.log("Minsky was asked to Speak!");
}
exports.speaks = speaks;
//# sourceMappingURL=minskylink.js.map