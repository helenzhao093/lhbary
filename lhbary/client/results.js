import { Template } from 'meteor/templating';

import './results.html';

Template.body.helpers({
	// should contain array of media info
	// returned from search
	results: [] 
})