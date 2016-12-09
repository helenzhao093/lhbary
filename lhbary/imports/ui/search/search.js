import { Template } from 'meteor/templating';
import './search.html';

Template.body.events({
	'submit .form_simple_search'(event) {
		console.log("submitted form");
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		console.dir(keyword_search);
		FlowRouter.go('/search_results', text);
		// pass in words to SQL query for
		// keywords,
		// titles,
		// authors
	}
})


// TODO: Advanced search

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })






