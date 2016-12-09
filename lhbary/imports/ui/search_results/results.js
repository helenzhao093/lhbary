import { Template } from 'meteor/templating';

import './results.html';

Template.body.onCreated(function onBodyCreated() {
	this.state = new ReactiveDict();
	words = FlowRouter.getParam('query');
	keywordSearch = new MysqlSubscription('keywordSearch', words);
	ISBNSearch = new MysqlSubscription('ISBNSearch');
	// TODO: Advanced search	
})

// Template.body.helpers({
	// should contain array of media info
	// returned from search
	// results: [] 
// })
