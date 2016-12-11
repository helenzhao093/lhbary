import { Template } from 'meteor/templating';

import './search.html';

var languages, genres;

function isInteger(n) {
  return (parseFloat(n) == parseInt(n)) && !isNaN(n) && isFinite(n);
}

Template.index.events({
  'click #n-kws'(event) {
    $("#b-srch a").removeClass("active");
    $("#b-srch #n-kws a").addClass("active");
    $("#isbn_search").hide();
    $("#field_search").hide();
    $("#keyword_search").show();
  },
  'click #n-iss'(event) {
    $("#b-srch a").removeClass("active");
    $("#b-srch #n-iss a").addClass("active");
    $("#keyword_search").hide();
    $("#field_search").hide();
    $("#isbn_search").show();
  },
  'click #n-fss'(event) {
    $("#b-srch a").removeClass("active");
    $("#b-srch #n-fss a").addClass("active");
    $("#keyword_search").hide();
    $("#isbn_search").hide();
    $("#field_search").show();
  },
})

Template.keyword_search.events({
  'submit .form_simple_search'(event) {
    event.preventDefault();
    const text = event.target.text.value;
    var path = FlowRouter.path('/search_results', {}, {keywords: text});
    FlowRouter.go(path);
    },
});

Template.isbn_search.events({
  'submit .form_isbn_search'(event) {
      event.preventDefault();
      const text = event.target.text.value;
      if (isInteger(text) && text.length == 13 ) {
          var path = FlowRouter.path('/search_results', {}, {ISBN: text});
          FlowRouter.go(path);
      } else {
        var warning = $("#div_isbn_search #warning");
        function flashYellow() {
          warning.addClass("alert-warning");
          warning.removeClass("alert-danger");
        }
        function flashRed() {
          warning.addClass("alert-danger");
          warning.removeClass("alert-warning");
          setTimeout(flashYellow, 200);
        }
        warning.show();
        setTimeout(flashRed, 200);
        setTimeout(flashRed, 600);
      }
  },
});

Template.field_search.onCreated(function () {
  languages = new MysqlSubscription('languages');
  genres = new MysqlSubscription('genres');
  publishers = new MysqlSubscription('publishers');
  libraries = new MysqlSubscription('libraries');
});

Template.field_search.helpers({
  languages: function() {
    return languages.reactive();
  },
  genres: function() {
    return genres.reactive();
  },
  publishers: function() {
    return publishers.reactive();
  },
  libraries: function() {
    return libraries.reactive();
  },
});

Template.field_search.events({
  'submit #field_search'(event) {
    event.preventDefault();
    let title = $("#input_title").val();//split this at server
    let genre = $("#input_genre").val();//space concat, split@server
    let publishers = $("#input_publishers").val();//space concat, split@server
    let libraries = $("#input_libraries").val();//space concat, split@server
    let authors = $("#input_authors").val();//split this at server
    let subjects = $("#input_subjects").val();//split this at server
    let keywords = $("#input_keywords").val();//split this at server
    let availability = $("#input_availability").val();
    let language = $("#input_language").val();//space concat this, split@server
    let year_sel = $("#input_year_sel").val();
    let year = $("#input_year").val();
    // $ANY is the escaping type for "don't care"
    // Char ones that are null have "" though



  }
});
