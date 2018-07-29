'use strict';

const store = (function() {

  //Function
  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  return {
    bookmarks: [],
    error: null,
    adding: false,
    minRating: 0,
    
    setError,
    addBookmark
  };

}());