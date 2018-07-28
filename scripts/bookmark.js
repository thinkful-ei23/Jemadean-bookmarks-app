'use strict';
/* global store, $ */
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
    $(':submit').submit()()
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
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
