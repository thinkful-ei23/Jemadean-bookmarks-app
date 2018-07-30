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

  //Function to generate error message
  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
      `;
  } 

  //Function to close error message
  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', function() {
      store.setError(null);
      console.log('handleCloseError ran');
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
          console.log('there has been an error', err);
          store.setError(err);
          render();
        });
    });
  }

  //Function to generate the bookmark element
  function generateBookmarkElement(bookmark) {
    let detailsCardClass = `hidden class="details-card js-details-card"`;
    if (bookmark.expanded) {
      detailsCardClass = `class="details-card js-details-card"`;
    }
    return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <p class="title-bar js-title-bar">${bookmark.title}</p> 
        <div ${detailsCardClass}>
          <article class="details js-details"></article>
            <p class="description">${bookmark.desc}</p>
            <p><a href=${bookmark.url}>Visit Site</a></p>
          </article>
        </div>
        <span class="rating js-rating">${bookmark.rating} Stars</span>
        <button type="button" class="delete-bookmark">Delete Bookmark</button>
      </li>`;
  }

  //Function to generate string that will next get rendered to DOM
  function generateStringOfBookmarks(myBookmarks) {
    const bookmarks = myBookmarks.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  //Function to get ID 
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }

  //Function to update store when expand details is clicked
  function handleExpandDetailsClick() {
    $('.js-bookmark-list').on('click', '.js-title-bar', function(event) {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      store.findAndUpdate(id, {expanded : !bookmark.expanded});
      console.log('handleExpandDetailsClick ran', store);
      render();
    });
  }

  //Function to delete bookmarks
  function handleDeleteBookmarkClick() {
    $('.js-bookmark-list').on('click', '.delete-bookmark', function(event) {
      const id = getBookmarkIdFromElement(event.currentTarget); 
      api.deleteItem(id, function() {
        store.findAndDelete(id);
        console.log('handleDeleteBookmarkClick ran');
        render();
      });
    });
  }

  //Function to render the page 
  function render() {
    if (store.adding) {
      $('#js-add-bookmark-form').show();
    } else {$('#js-add-bookmark-form').hide();}

    if (store.error) {
      const problem = generateError(store.error);
      $('.error-container').html(problem);
    } else {
      $('.error-container').empty();
    }
    
    // render the bookmarks in the DOM
    let bookmarks = store.bookmarks;
    const bookmarksString = generateStringOfBookmarks(bookmarks);
    $('.js-bookmark-list').html(bookmarksString);
    console.log('render ran', store);
  }

  function bindEventListeners() {
    handleAddBookmarkClick();
    handleCreateBookmarkSubmit();
    handleExpandDetailsClick();
    handleDeleteBookmarkClick();
    handleCloseError();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
