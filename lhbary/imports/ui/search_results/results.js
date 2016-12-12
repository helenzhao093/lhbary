import { Template } from 'meteor/templating';

import './results.html';

var results;

Template.Search_results.onCreated(function() {
  this.currentTab = new ReactiveVar();
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
    setTimeout(noResults, 10000);
    return books;
  },
});

Template.Search_results.events({
  'click #back button'(event) {
    FlowRouter.go('/search')
  },
});

Template.book.events({
  'click .get_author'(event) {
    event.preventDefault();
    let info = event.target.value.split(':');
    var authList = new MysqlSubscription('authorsOf', {ISBN: info[0], insta_no: info[1]});
    authList = authList.reactive();
    function checkAuthors() {
      if (authList.length) {
        var authors = authList.map(a => a.name).reduceRight((a, b) => a + ', ' + b);
        $("#auth_" + info[0] + "_" + info[1]).html("<strong>Authors: </strong>" + authors + "<br>");
        clearInterval(timer);
      }
    }
    var timer = setInterval(checkAuthors, 100);
  }
});


