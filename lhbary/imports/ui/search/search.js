import { Template } from 'meteor/templating';

import './results.html';

Template.title_search.events({
	'submit form_simple_search'(event) {
		event.preventDefault();

		const target = event.target;
		const text = target.text.value;

		const words = text.split(' ');
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





