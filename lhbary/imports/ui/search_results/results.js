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
		return results.reactive();
	},
});

