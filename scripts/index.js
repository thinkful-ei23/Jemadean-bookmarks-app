'use strict';
/* global myBookmarks, store, api,  $ */
// const state = {
//   items: [
//     {id: 1, title: 'Coding 101', rating: 5, expanded: true, url: 'https://thinkful.com', description: "Test"},
//     {id: 2, title: 'Blockchain', rating: 4, expanded: false, url: 'http://blockchain.com', description: "Understanding blockchain from zero"},
//     {id: 3, title: 'Salsa in SD', rating: 3, expanded: false, url: 'http://sdsalsa.com', description: "Salsa club listings in San Diego"}
//   ], 
//   adding: false,
//   minRating: 0
// };

$(document).ready(function() {
  myBookmarks.bindEventListeners();
  myBookmarks.render();
  console.log('docready ran');

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
    myBookmarks.render();
  });
});