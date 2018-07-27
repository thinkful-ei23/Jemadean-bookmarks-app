'use strict';
/* global store, $ */
const myBookmarks = (function(){

  //Function to handle add bookmark click
  function handleAddBookmarkClick(){
    $('.add-bookmark').on('click', function(event) {
      console.log('handleAddBookmarkClick ran', store);
      store.adding = true;
      render();
    });
  }

  function render() {
    if (store.adding) {
      $('#js-add-bookmark-form').show();
    } else $('#js-add-bookmark-form').hide();
    console.log('render ran');
  }

  function bindEventListeners() {
    handleAddBookmarkClick();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
