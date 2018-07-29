'use strict';
/* global store, state, api, $ */
const myBookmarks = (function(){

  //Function to capture all form data at once and turn it into a string for server
  function serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }

  //Function to extend jQuery API, make serializeJson available on any jQuery objects in this project
  $.fn.extend({
    serializeJson: function() {
      const formData = new FormData(this[0]);
      const o = {};
      formData.forEach((val, name) => o[name] = val);
      return JSON.stringify(o);
    }
  });

  //Function to handle add bookmark click
  function handleAddBookmarkClick(){
    $('.add-bookmark').on('click', function(event) {
      console.log('handleAddBookmarkClick ran', store);
      store.adding = true;
      render();
    });
  }

  //Function to handle create bookmark submit
  function handleCreateBookmarkSubmit(){
    $('#js-add-bookmark-form').on('submit',function(event) {
      console.log('handleCreateBookmarkSubmit ran');
      event.preventDefault();
      const newBookmarkData = $('#js-add-bookmark-form');
      const serializedBookmarkData = newBookmarkData.serializeJson();
      console.log(serializedBookmarkData);
      api.createBookmark(serializedBookmarkData, 
        (serializedBookmarkData) => {
          $('#js-add-bookmark-form')[0].reset();
          store.adding = false;
          store.addBookmark(serializedBookmarkData);          
          render();
        },
        (err) => {
          console.log(err);
          store.setError(err);
          render();
        });
    });
  }

  //Function to render the page 
  function render() {
    if (store.adding) {
      $('#js-add-bookmark-form').show();
    } else $('#js-add-bookmark-form').hide();
    console.log('render ran', store);
  }

  function bindEventListeners() {
    handleAddBookmarkClick();
    handleCreateBookmarkSubmit();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
