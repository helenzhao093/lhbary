import { Template } from 'meteor/templating';
import './search.html';

Template.Search.events({
	'submit .form_simple_search'(event) {
		console.log("submit.");
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		console.dir(keyword_search);
		var path = FlowRouter.path('/search_results', {}, {keywords: text});
		FlowRouter.go(path);
		// pass in words to SQL query for
		// keywords,
		// titles,
		// authors
	},
});


// TODO: Advanced search

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })






