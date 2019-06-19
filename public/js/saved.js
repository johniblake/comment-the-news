// Grab the articles as a json
// $.getJSON("/api/saved", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append(
//       "<p data-id='" +
//         data[i]._id +
//         "'>" +
//         data[i].title +
//         "<br />" +
//         data[i].link +
//         "</p>"
//     );
//   }
// });

$(document).on("click", ".unsave-button", function() {
  let id = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "api/articles/unsave/" + id
  }).then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#" + id).remove();

    if ($(".article-container").children().length === 0) {
      let noArticleBanner = $("<div>");
      noArticleBanner.addClass("no-articles-banner");
      noArticleBanner.html(
        "Uh Oh. Looks like we don't have any saved articles."
      );
      $(".article-container").append(noArticleBanner);
    }
  });
});

//stolen from example
$(document).on("click", ".notes-button", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/api/notes/" + thisId
  })
    // With that done, add the note information to the page
    .then(data => {
      console.log(data);
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Notes For Article: " + data.title),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='52'>"),
        $("<button class='btn btn-success save-button'>Save Note</button>")
      );
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: data._id,
        notes: data.notes || []
      };
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save-button").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
});

// When you click the savenote button
$(document).on("click", ".save-button", function() {
  // This function handles what happens when a user tries to save a new note for an article
  // Setting a variable to hold some formatted data about our note,
  // grabbing the note typed into the input box
  var noteData;
  var newNote = $(".bootbox-body textarea")
    .val()
    .trim();
  // If we actually have data typed into the note input field, format it
  // and post it to the "/api/notes" route and send the formatted noteData as well
  if (newNote) {
    noteData = { _headlineId: $(this).data("article")._id, noteText: newNote };
    $.ajax({
      method: "POST",
      url: "api/notes/",
      data: noteData
    }).then(function() {
      // When complete, close the modal
      bootbox.hideAll();
    });
  }
});

//stolen from example

function renderNotesList(data) {
  // This function handles rendering note list items to our notes modal
  // Setting up an array of notes to render after finished
  // Also setting up a currentNote variable to temporarily store each note
  var notesToRender = [];
  var currentNote;
  if (!data.notes.length) {
    // If we have no notes, just display a message explaining this
    currentNote = $(
      "<li class='list-group-item'>No notes for this article yet.</li>"
    );
    notesToRender.push(currentNote);
  } else {
    // If we do have notes, go through each one
    for (var i = 0; i < data.notes.length; i++) {
      // Constructs an li element to contain our noteText and a delete button
      currentNote = $("<li class='list-group-item note'>").append(
        $("<div>").text(data.notes[i].body)
      );
      currentNote.append(
        $("<button class='btn btn-danger note-delete'>x</button>")
      );
      // Store the note id on the delete button for easy access when trying to delete
      currentNote.children("button").data("_id", data.notes[i]._id);
      // Adding our currentNote to the notesToRender array
      notesToRender.push(currentNote);
    }
  }
  // Now append the notesToRender to the note-container inside the note modal
  $(".note-container").append(notesToRender);
}
