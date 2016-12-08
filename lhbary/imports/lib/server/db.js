var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })

Meteor.publish('keywordSearch', function(input) {
	// injection vulnerable...
	where = input.split(' ')
		.map(a => `(m.title LIKE '%${a}%') OR m.genre == '${a}' OR m.subject == '${a}' OR (m.keywords LIKE '%${a}%') OR (m.name LIKE '%${a}%')`)
		.reduceRight((a, b) => `${a} OR ${b}`)

	return liveDb.select(
		`SELECT * FROM (Authors NATURAL JOIN Authored) RIGHT JOIN Media m WHERE ${where}`,
		[ { table: 'Media' } ]
		);
})

Meteor.publish('ISBNSearch', function(ISBN) {
	// injection vulnerable...
	return liveDb.select(
		`SELECT * FROM Media m WHERE m.ISBN == ${ISBN}`,
		[ { table: 'Media' } ]
		);
})

// Closing connections between hot code-pushes
// as per https://github.com/numtel/meteor-mysql#closing-connections-between-hot-code-pushes
var closeAndExit = function() {
    liveDb.end();
    process.exit();
};

process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);
