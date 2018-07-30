'use strict';
/* global $ */

const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jemadean';

  const getBookmarks = function(callback) {
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const createBookmark = function(serializedData, onSuccess, onError) {
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: serializedData,
      success: onSuccess,
      error: onError
    });
  };

  const deleteItem = function(id, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
    });
  };

  return {
    getBookmarks,
    createBookmark,
    deleteItem
  };
}());