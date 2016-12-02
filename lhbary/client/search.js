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

var liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish('keywordSearch', function(words) {
	// Escape to prevent injection
	// TODO - commit first
	return liveDb.select(
		'SELECT * FROM players ORDER BY score DESC',
		[ { table: 'players' } ]
		);
})





