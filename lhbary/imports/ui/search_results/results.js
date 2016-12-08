import { Template } from 'meteor/templating';

import './results.html';

Template.body.oncreated(function onBodyCreated() {
	this.state = new ReactiveDict();
	keywordSearch = new MysqlSubscription('keywordSearch');
	ISBNSearch = new MysqlSubscription('ISBNSearch');
	// TODO: Advanced search	
})

// Template.body.helpers({
	// should contain array of media info
	// returned from search
	// results: [] 
// })