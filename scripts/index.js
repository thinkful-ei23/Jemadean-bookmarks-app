'use strict';
/* global myBookmarks, store, api,  $ */

$(document).ready(function() {
  myBookmarks.bindEventListeners();
  myBookmarks.render();
  console.log('docready ran');

  //gets bookmarks info from the server, adds them to the store and tacks on an expanded key with a value of false so page always renders with details hidden.  Renders page.
  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    myBookmarks.render();
  });
});