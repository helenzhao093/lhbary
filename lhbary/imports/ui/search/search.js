import { Template } from 'meteor/templating';

import './search.html';

var languages, genres;

function isInteger(n) {
  return (parseFloat(n) == parseInt(n)) && !isNaN(n) && isFinite(n);
}

Template.search_index.events({
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

var spaceConcat = (a, b) => a + ' ' + b;
var colonConcat = (a, b) => a + ':' + b;

Template.field_search.events({
  'submit #field_search'(event) {
    event.preventDefault();
    let title = $("#input_title").val();//split this at server
    if (!title) {
      title = "$ANY";
    }

    let authors = $("#input_authors").val();//split this at server
    if (!authors) {
      authors = "$ANY";
    }

    let subjects = $("#input_subjects").val();//split this at server
    if (!subjects) {
      subjects = "$ANY";
    }

    let keywords = $("#input_keywords").val();//split this at server
    if (!keywords) {
      keywords = "$ANY";
    }

    // Selecting nothing? It'd ensure NO RESULTS - so we interpret it as "any"
    let genre = $("#input_genre").val();//space concat, split@server
    if (!!genre) {
      genre = genre.reduceRight(colonConcat);
    } else {
      genre = "$ANY";
    }

    let publishers = $("#input_publishers").val();//space concat, split@server
    if (!!publishers) {
      publishers = publishers.reduceRight(colonConcat);
    } else {
      publishers = "$ANY";
    }

    let libraries = $("#input_libraries").val();//space concat, split@server
    if (!!libraries) {
      libraries = libraries.reduceRight(colonConcat);
    } else {
      libraries = "$ANY";
    }

    let language = $("#input_language").val();//space concat this, split@server
    if (!!language) {
      language = language.reduceRight(colonConcat);
    } else {
      language = "$ANY";
    }

    let availability = $("#input_availability").val();
    let year_sel = $("#input_year_sel").val();
    let year = $("#input_year").val();
    // $ANY is the escaping type for "don't care"
    // Char ones that are null have "" though

    var path = FlowRouter.path('/search_results', {}, {
      advanced: true,
      a_title: title,
      a_authors: authors,
      a_subjects: subjects,
      a_keywords: keywords,
      a_genre: genre,
      a_publishers: publishers,
      a_libraries: libraries,
      a_language: language,
      a_availability: availability,
      a_year_sel: year_sel,
      a_year: year
    });

    FlowRouter.go(path);
  }
});
