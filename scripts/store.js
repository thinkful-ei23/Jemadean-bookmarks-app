'use strict';

const store = (function() {

  //Function
  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) { 
    bookmark.expanded = false;
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    Object.assign (bookmark, newData);
  };

  return {
    bookmarks: [],
    error: null,
    adding: false,
    minRating: 0,
    
    setError,
    addBookmark, 
    findById,
    findAndUpdate
  };

}());