$(document).on("click", ".save-button", function() {
  let id = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "api/articles/save/" + id
  }).then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#" + id).remove();
  });
});

$(document).on("click", ".clear-button", function() {
  $.ajax({
    method: "DELETE",
    url: "api/articles/"
  }).then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $(".article-container").empty();
    let noArticleBanner = $("<div>");
    noArticleBanner.addClass("no-articles-banner");
    noArticleBanner.html(
      "No more articles :( Refresh page to scrape fresh ones!"
    );
    $(".article-container").append(noArticleBanner);
  });
});
