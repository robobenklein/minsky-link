import "atom";
import { CompositeDisposable } from "atom";
import { TextEditor } from "atom";
import { DisplayMarker } from "atom";
import { DisplayMarkerLayer } from "atom";

import { test_getComment } from "../github/test";

import { getRepoNames } from "../github/get_names";

//@ts-ignore
// import "./view_pane";

//@ts-ignore
 import { GithubPackage } from "github";

var regex1_gh: RegExp = new RegExp(/(GH([0-9]+))/, "gm");

console.log(String("Loading Minsky Link"));

//@ts-ignore
 console.log("GithubPackage repo: " + GithubPackage.getActiveRepository());

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
    "minsky:testGitHub": () => test_getComment()
  })
);

// This is an active command function. You can add more in the
// activate function.
export function speaks(): void {
  console.log("Minsky was asked to Speak!");
}

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

subscriptions.add(
  atom.commands.add("atom-workspace", {
    "minsky:open-issue-tag-from-cursor-position": () =>
      openIssueishFromCursorPosition()
  })
);
atom.contextMenu.add({
  "atom-text-editor": [
    {
      label: "Minsky",
      submenu: [
        {
          label: "Open Issue",
          command: "minsky:open-issue-tag-from-cursor-position"
        }
      ]
    }
  ]
});

export function openIssueishFromCursorPosition(): void {
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
    "Minsky-Link: Hijack-Loading #" + target_properties["minsky"],
    {
      description:
        "Opening hijack pane for issue #" + target_properties["minsky"],
      dismissable: true
    }
  );

  // XXX new idea: hijack github views
  // for now since GH84 is in the way, let's just assume it's here

  var reposlug = getRepoNames();

  var current_repo = atom.project.getRepositories()[0];
  var git_workdir = current_repo.getWorkingDirectory();

  atom.workspace.open(
    "atom-github://issueish/" +
      encodeURIComponent("https://api.github.com") +
      "/" +
      reposlug[0] +
      "/" +
      reposlug[1] +
      "/" +
      target_properties["minsky"] +
      "?workdir=" +
      encodeURIComponent(git_workdir)
  );

  console.log("End of openIssueishFromCursorPosition.");
}
//*/
