'use strict';
/* global myBookmarks, store, api,  $ */

$(document).ready(function() {
  myBookmarks.bindEventListeners();
  myBookmarks.render();
  console.log('docready ran');

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    myBookmarks.render();
  });
});