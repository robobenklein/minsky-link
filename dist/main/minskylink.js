"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("atom");
console.log(String("Loading Minsky Link"));
// HOVER LISTENER GH40
// search for issue tags in a TextBuffer and apply markers to them
function findIssueTags(textToSearch) {
    var regex1 = new RegExp(/( GH([0-9]+))/);
    textToSearch.scan(regex1, scanResult => {
        var issue_number = parseInt(scanResult.match[2]);
        console.log("Found issue tag: " + scanResult.matchText);
        console.log("Creating marker on " + scanResult.range);
        var new_marker = textToSearch.markRange(scanResult.range, {
            invalidate: 'touch'
        });
        console.log("Created marker for issue #" + issue_number + ": " + new_marker.getStartPosition());
    });
}
// const subscriptions = new CompositeDisposable();
atom.workspace.observeTextEditors(editor => {
    console.log("Opening editor: " + editor.getLongTitle());
    console.log("Running scan on " + editor.getLongTitle());
    findIssueTags(editor.getBuffer());
    // TODO place hook on the buffer being edited:
});
//# sourceMappingURL=minskylink.js.map