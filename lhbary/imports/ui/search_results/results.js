import { Template } from 'meteor/templating';

import './results.html';

var results;

Template.Search_results.onCreated(function() {
  this.currentTab = new ReactiveVar();
  // console.log("page loaded");

  var keywords = FlowRouter.getQueryParam('keywords');
  var ISBN = FlowRouter.getQueryParam('ISBN');

  if (!!keywords)
    results = new MysqlSubscription('keywordSearch', keywords);
  else if (!!ISBN)
    results = new MysqlSubscription('ISBNSearch', ISBN);

  window.results = results;
  console.log(window.results);
});

Template.Search_results.helpers({
  results: function() {
    var books = results;
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

