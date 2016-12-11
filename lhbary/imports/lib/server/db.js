var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish('keywordSearch', function(input) {
	wh_a = input.split(' ')
		//.map(a => liveDb.db.escape(a))
		.map(a => `a.name LIKE '%${a}%'`)
		.reduceRight((a, b) => `${a} OR ${b}`);

	wh_m = input.split(' ')
		.map(a => `m.title LIKE '%${a}%' OR m.genre = '${a}' OR m.subject = '${a}' OR m.keywords LIKE '%${a}%'`)
		.reduceRight((a, b) => `${a} OR ${b}`);

        query = `SELECT m.*, l.lib_name
                FROM Media m, Library l
                WHERE (
                (${wh_m}) OR EXISTS (SELECT *
                FROM Authors a NATURAL JOIN Authored d
                WHERE (d.ISBN = m.ISBN AND d.insta_no = m.insta_no) AND (${wh_a}))) AND l.lib_id = m.lib_id`;

//		console.log(query);
	
	return liveDb.select(query, [ { table: 'Media' }, {table : 'Authors'}, {table: 'Authored'} ]);
});


Meteor.publish('authorsOf', function(book) {

        query = `SELECT Authors.name FROM Authors NATURAL JOIN Authored d
                WHERE d.ISBN = ${book.ISBN} AND d.insta_no = ${book.insta_no}`

        return liveDb.select(query,
                [{table : 'Authors'}, {table: 'Authored'}]);
});

Meteor.publish('ISBNSearch', function(ISBN) {
        // injection vulnerable...
        return liveDb.select(
                `SELECT * FROM Media m WHERE m.ISBN = ${ISBN}`,
                [ { table: 'Media' } ]
                );
});

Meteor.publish('languages', function() {
	return liveDb.select('SELECT DISTINCT Media.language FROM Media',
		[ { table: 'Media' } ]
		);
});

Meteor.publish('genres', function() {
	return liveDb.select('SELECT DISTINCT Media.genre FROM Media',
		[ { table: 'Media' } ]
		);
});

Meteor.publish('publishers', function() {
        return liveDb.select('SELECT DISTINCT Media.publisher FROM Media WHERE Media.publisher != ""',
                [ { table: 'Media' } ]
                );
});

Meteor.publish('libraries', function() {
        return liveDb.select('SELECT DISTINCT l.lib_name FROM Media NATURAL JOIN Library l',
                [ { table: 'Media' }, { table: 'Library' } ]
                );
});

// Closing connections between hot code-pushes
// as per https://github.com/numtel/meteor-mysql#closing-connections-between-hot-code-pushes
var closeAndExit = function() {
    liveDb.end();
    process.exit();
};

process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);

