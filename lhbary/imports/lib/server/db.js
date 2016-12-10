var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish('keywordSearch', function(input) {
	wh_a = input.split(' ')
		//.map(a => liveDb.db.escape(a))
		.map(a => `a.name = '${a}'`)
		.reduceRight((a, b) => `${a} OR ${b}`);

	wh_m = input.split(' ')
		.map(a => `m.title LIKE '%${a}%' OR m.genre = '${a}' OR m.subject = '${a}' OR m.keywords LIKE '%${a}%'`)
		.reduceRight((a, b) => `${a} OR ${b}`);

        query = `SELECT m2.* FROM
		((SELECT * FROM Authors a WHERE ${wh_a}) a1 NATURAL JOIN Authored d)
		RIGHT JOIN (SELECT * FROM Media m WHERE ${wh_m}) t
        	ON (d.ISBN = t.ISBN AND d.insta_no = t.insta_no), Media m2
		WHERE t.ISBN = m2.ISBN AND t.insta_no = m2.insta_no`;
	
//   	console.log(query);

	return liveDb.select(query, [ { table: 'Media' }, {table : 'Authors'}, {table: 'Authored'} ]);
});

Meteor.publish('ISBNSearch', function(ISBN) {
        // injection vulnerable...
        return liveDb.select(
                `SELECT * FROM Media m WHERE m.ISBN == ${ISBN}`,
                [ { table: 'Media' } ]
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

