import { Template } from 'meteor/templating';

import './results.html';

var results;

Template.Search_results.onCreated(function() {
  this.currentTab = new ReactiveVar();
  // console.log("page loaded");

  var keywords = FlowRouter.getQueryParam('keywords');
  var ISBN = FlowRouter.getQueryParam('ISBN');
  var advanced = FlowRouter.getQueryParam('advanced');

  if (!!keywords) {
    results = new MysqlSubscription('keywordSearch', keywords);
  } else if (!!ISBN) {
    results = new MysqlSubscription('ISBNSearch', ISBN);
  } else if (!!advanced) {
    params = {
      title: FlowRouter.getQueryParam('a_title'),
      authors: FlowRouter.getQueryParam('a_authors'),
      subjects: FlowRouter.getQueryParam('a_subjects'),
      keywords: FlowRouter.getQueryParam('a_keywords'),
      genre: FlowRouter.getQueryParam('a_genre'),
      publishers: FlowRouter.getQueryParam('a_publishers'),
      libraries: FlowRouter.getQueryParam('a_libraries'),
      language: FlowRouter.getQueryParam('a_language'),
      availability: FlowRouter.getQueryParam('a_availability'),
      year_sel: FlowRouter.getQueryParam('a_year_sel'),
      year: FlowRouter.getQueryParam('a_year')
    };
    results = new MysqlSubscription('fieldSearch', params);
  } else {
    $("#results").html("An invalid search was specified.");
  }

  window.results = results;
  console.log(window.results);
});

var books;

function noResults() {
  if (!(!!books && books.length)) {
    $("#results").html("There were no results for your search.");
  }
}

Template.Search_results.helpers({
  results: function() {
    books = results;
    books = books.reactive();
    // if (books.length > 0) {
      // window.books = {};
      // books.forEach(function(book,i,arr){
        // window.books[i] = new MysqlSubscription('authorsOf', book);
        // book.authorList = window.books[i];
        // book.authorList = new MysqlSubscription('authorsOf', book);
        // console.log(book.authorList.length);
      // });

      // books.forEach(function(book, i, arr){
        // book.authorList.reactive()forEach(function(au, i, arr){
          // print(au);
        // });
        // console.log(book.authorList);
        // console.log(book.authorList.length);
        // console.log(book.authorList.subscriptionId);
        // book.authors = book.authorList.map(a => a.name);
        // console.log(book.authors);
        // book.authors = authors.reduceRight((a, b) => a + ', ' + b);
      // });

      // window.books2 = books;
    // }
    setTimeout(noResults, 10000);

    return books;
  },
});

Template.Search_results.events({
  'click #back button'(event) {
    FlowRouter.go('/search')
  },
});

// Template.authors.onCreated(function() {

// });

Template.book.events({
  'click .get_author'(event) {
    event.preventDefault();
    let info = event.target.value.split(':');
    console.log(info);
    var authList = new MysqlSubscription('authorsOf', {ISBN: info[0], insta_no: info[1]});
    console.log(authList);
    authList = authList.reactive();
    function checkAuthors() {
      if (authList.length) {
        var authors = authList.map(a => a.name).reduceRight((a, b) => a + ', ' + b);
        console.log(authors);
        console.log("#auth_" + event.target.value);
        $("#auth_" + info[0] + "_" + info[1]).html("<strong>Authors: </strong>" + authors + "<br>");
        clearInterval(timer);
      }
    }

    var timer = setInterval(checkAuthors, 100);
  }
});


