import { Template } from 'meteor/templating';

import './search.html';

var languages;

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
});

Template.field_search.helpers({
  languages: function() {
    return languages.reactive();
  },
});

