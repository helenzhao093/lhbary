var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

Meteor.publish('keywordSearch', function(input) {
        let wh_a = input.split(' ')
                //.map(a => liveDb.db.escape(a))
                .map(a => `a.name LIKE '%${a}%'`)
                .reduceRight((a, b) => `${a} OR ${b}`);

        let wh_m = input.split(' ')
                .map(a => `m.title LIKE '%${a}%' OR m.genre = '${a}' OR m.subject = '${a}' OR m.keywords LIKE '%${a}%'`)
                .reduceRight((a, b) => `${a} OR ${b}`);

        let query = `SELECT m.*, l.lib_name
                FROM Media m, Library l
                WHERE (
                (${wh_m}) OR EXISTS (SELECT *
                FROM Authors a NATURAL JOIN Authored d
                WHERE (d.ISBN = m.ISBN AND d.insta_no = m.insta_no) AND (${wh_a}))) AND l.lib_id = m.lib_id`;

        return liveDb.select(query, [ { table: 'Media' }, {table : 'Authors'}, {table: 'Authored'} ]);
});


Meteor.publish('authorsOf', function(book) {
        let query = `SELECT Authors.name FROM Authors NATURAL JOIN Authored d
                WHERE d.ISBN = ${book.ISBN} AND d.insta_no = ${book.insta_no}`

        return liveDb.select(query,
                [{table : 'Authors'}, {table: 'Authored'}]);
});

Meteor.publish('ISBNSearch', function(ISBN) {
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

Meteor.publish('fieldSearch', function(params) {
        let ANY = "$ANY";
        let wholeWord = (a => `'([[:blank:]]|[[:punct:]]|^)${a}([[:punct:]}|[[:blank:]]|$)'`)

        // Passed in as string delimited
        let m_title = params.title == ANY ? "" : params.title.split(' ')
                .map(a => `m.title REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} AND ${b}`);

        let m_subjs = params.subjects == ANY ? "" : params.subjects.split(' ')
                .map(a => `m.subject REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} AND ${b}`);

        let m_keyws = params.keywords == ANY ? "" : params.keywords.split(' ')
                .map(a => `m.keywords REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} AND ${b}`);

        let m_genre = params.genre == ANY ? "" : params.genre.split(':')
                .map(a => `m.genre = '${a}'`)
                .reduceRight((a, b) => `${a} OR ${b}`);

        // publisher might be """"
        let m_pblsh = params.publishers == ANY ? "" : 
                params.publishers == '""' ? 'm.publisher = ""' : 
                params.publishers.split(':')
                .map(a => `m.publisher REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} OR ${b}`);

        let m_langs = params.language == ANY ? "" : params.language.split(':')
                .map(a => `m.language = '${a}'`)
                .reduceRight((a, b) => `${a} OR ${b}`);

        let m_avail = params.availability == ANY ? "" : `m.status = '${params.availability}'`;

        let m_yearp = params.year_sel == ANY ? "" : `m.year ${params.year_sel} ${params.year}`;

        let wh_a = params.authors == ANY ? "" : "d.author_id = a.author_id " +
                "AND d.ISBN = m.ISBN AND d.insta_no = m.insta_no AND (" +
                params.authors.split(' ')
                .map(a => `a.name REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} AND ${b}`) + ")";

        let wh_l = params.libraries == ANY ?"": "l.lib_id = m.lib_id AND (" +
                params.libraries.split(':')
                .map(a => `l.lib_name REGEXP ${wholeWord(a)}`)
                .reduceRight((a, b) => `${a} OR ${b}`) + ")";

        let where = [wh_a, wh_l, m_title, m_subjs, m_keyws,
                m_genre, m_pblsh, m_langs,
                m_avail, m_yearp, ""];

        // Emptiness propagates - first nonempty is prepepended with WHERE
        // and rest nonempty are prepended with AND
        where = where.reduceRight((a, b) => {
                if (!a)
                        return !!b ? `WHERE (${b})` : "";
                else
                        return !!b ? a + ` AND (${b})` : a;
        });

        var tables = [{table: 'Media'}];
        var from = "Media m NATURAL JOIN Library l";
        // if any author stuff
        if (!!wh_a) {
                tables.push({table: 'Authors'});
                tables.push({table: 'Authored'});
                from += ", Authors a, Authored d";
        }

        let query = `SELECT DISTINCT m.*, l.lib_name
                FROM ${from}
                ${where};`;

        return liveDb.select(query, tables);
});

Meteor.publish('lib_name', function(){
    return liveDb.select(
	'SELECT lib_name FROM Library',
	[{table: 'Library'}]
    );
})

Meteor.publish('selectFromLibName', function(lib){
    return liveDb.select(
	'SELECT * FROM Library WHERE lib_name = ' + liveDb.db.escape(lib),
	[{ table: 'Library' }]
    );
})

Meteor.publish('libraryInfo', function(lib){
    return liveDb.select(
	'SELECT * FROM Library WHERE lib_id = ' + liveDb.db.escape(lib),
	[{ table: 'Library' }]
    );
})

Meteor.publish('checkoutMedia', function(lib){
    return liveDb.select(
	'SELECT C.ISBN, C.insta_no, M.title, C.card_id , C.expiry FROM Checkout C NATURAL JOIN Media M WHERE M.lib_id = ' + liveDb.db.escape(lib),
	[{table: 'Checkout' }, {table: 'Media'}]
    );
})

Meteor.publish('reservedAtLib', function(lib){
    return liveDb.select(
	'SELECT M.ISBN, M.insta_no, M.title, M.card_id, R.expiry FROM Reserve R NATURAL JOIN Media M WHERE dest_lib = ' + liveDb.db.escape(lib),
	[{ table: 'Reserve' }, {table: 'Media'}]
    );
})

Meteor.methods({
    'insertCheckout': function(ISBN, insta_no, card_id, checkdate){
	try{
	    Meteor.wrapAsync(liveDb.db.query)(
		'INSERT INTO Checkout SET ISBN = ?, insta_no = ?, card_id = ?, dateout = ?', [ISBN, insta_no, card_id, checkdate]
		, function (err, result){
		if (err) {throw new Meteor.Error("can not insert");}
		}
	    )
	}
	catch (error){
	    throw new Meteor.Error("catch cannot insert");}
    }
});

export default liveDb;
// Closing connections between hot code-pushes
// as per https://github.com/numtel/meteor-mysql#closing-connections-between-hot-code-pushes

var closeAndExit = function() {
    liveDb.end();
    process.exit();
};

process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);

