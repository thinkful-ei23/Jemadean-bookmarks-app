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

  //Function to handle add bookmark click, listens for click, changes value of adding key in store to true. Page will be rendered with add bookmark form showing.
  function handleAddBookmarkClick(){
    $('.add-bookmark').on('click', function() {
      // console.log('handleAddBookmarkClick ran', store);
      store.adding = true;
      render();
    });
  }

  //Function to generate error message--generates error message with message from server or err code and 'server error' to be displayed when page is rendered.  This function is called upon page trying to render with a store error value = error.
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

  //Function to close error message--closes error message, resets store error value to null, renders page
  function handleCloseError() {
    $('.error-container').on('click', '#cancel-error', function() {
      store.setError(null);
      // console.log('handleCloseError ran');
      render();
    });
  }


  //Function to handle create bookmark submit--takes data from form, clears form, changes adding value in store to false, serializes data from form, posts to server, if valid adds bookmark info to store, and adds expanded key with value set to false.  Renders page, which will call generateStringOfBookmarks function, which calls generateBookmarkElement function to generate the element that will show on the page.  A string containing all the elements is then passed to render the page showing all of the elements as <li>s.
  function handleCreateBookmarkSubmit(){
    $('#js-add-bookmark-form').on('submit',function(event) {
      // console.log('handleCreateBookmarkSubmit ran');
      event.preventDefault();
      const newBookmarkData = $('#js-add-bookmark-form');
      const serializedBookmarkData = newBookmarkData.serializeJson();
      // console.log(serializedBookmarkData);
      api.createBookmark(serializedBookmarkData, 
        (serializedBookmarkData) => {
          $('#js-add-bookmark-form')[0].reset();
          store.adding = false;
          store.addBookmark(serializedBookmarkData);          
          render();
        },
        //if bookmark info submitted is not validated by server, set store error value to error, then go to render, which will call generateError(err), and render the page with the error message
        (err) => {
          // console.log('there has been an error', err);
          store.setError(err);
          render();
        });
    });
  }

  //Function to generate the bookmark element--expects bookmark details from store, turns them into an <li> element in the form of a string, also handles details view is hidden by default and shows when expanded = true.
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

  //Function to generate string that will next get rendered to DOM--iterate over the bookmarks in the store, run generateBookmarkElement on each of them, get a string back for each of them, join all of the strings together, so when the page renders and calls this function, all bookmark elements render to the page.
  function generateStringOfBookmarks(myBookmarks) {
    const bookmarks = myBookmarks.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
  }

  //Function to get ID -- goes up to the parent element to get the ID
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }

  //Function to update store when expand details is clicked--uses event delegation to listen for click, gets ID, uses it to identify which bookmark was clicked to expand details and changes it's expanded value in the store to true, renders the page with details showing for this particular bookmark as generateBookmarkElement runs with a different class for this particular bookmark.
  function handleExpandDetailsClick() {
    $('.js-bookmark-list').on('click', '.js-title-bar', function(event) {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      store.findAndUpdate(id, {expanded : !bookmark.expanded});
      // console.log('handleExpandDetailsClick ran', store);
      render();
    });
  }

  //Function to delete bookmarks--uses ID to identify which bookmark's delete button was clicked, deletes item from the server, updates the store with only itmes that do not have this particular ID, renders page with updated store info.
  function handleDeleteBookmarkClick() {
    $('.js-bookmark-list').on('click', '.delete-bookmark', function(event) {
      const id = getBookmarkIdFromElement(event.currentTarget); 
      api.deleteItem(id, function() {
        store.findAndDelete(id);
        // console.log('handleDeleteBookmarkClick ran');
        render();
      });
    });
  }

  //Function to handle dropdown selection--changes minRating value in store, renders page filtered by the minRating.
  function handleMinRatingSelection() {
    $('select').on('change', function(){
      store.minRating = $('select').val();
      // console.log(store.minRating, store);
      render();
    });
  }

  //Function to render the page 
    //Renders with add bookmark form showing when store.adding = true
  function render() {
    if (store.adding) {
      $('#js-add-bookmark-form').show();
    } else {$('#js-add-bookmark-form').hide();}
    
    //Renders with error message if error when submitting bookmark info
    if (store.error) {
      const problem = generateError(store.error);
      $('.error-container').html(problem);
    } else {
      $('.error-container').empty();
    }

    //Filter bookmark list by rating--renders page with bookmarks flitered by the value of minRating
    let bookmarks = store.bookmarks;
    bookmarks = store.bookmarks.filter(bookmark => bookmark.rating >= store.minRating);
    // console.log('render ran', store);
    
    // render the bookmarks in the DOM -- expects string of all bookmark elements and renders them as all of the bookmarks as <li>s in the <ul>.   
    const bookmarksString = generateStringOfBookmarks(bookmarks);
    $('.js-bookmark-list').html(bookmarksString); 
  }

  //binds all event listeners into one function
  function bindEventListeners() {
    handleAddBookmarkClick();
    handleCreateBookmarkSubmit();
    handleExpandDetailsClick();
    handleDeleteBookmarkClick();
    handleCloseError();
    handleMinRatingSelection();
  }

  //exposes only the render function and the bindEventListeners function--these will run once doc is loaded
  return {
    render: render,
    bindEventListeners: bindEventListeners
  };
}());
