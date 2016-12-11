var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })
//Meteor.users.insert({email: 'ACX0125@yahoo.com', password: 'hello1'});


Meteor.publish('libraryInfo', function(lib){
    return liveDb.select(
	'SELECT * FROM Library WHERE lib_id = ' + liveDb.db.escape(lib),
	[{ table: 'Library' }]
    );
})

Meteor.publish('checkoutMedia', function(params){
    return liveDb.select(
	`SELECT C.ISBN, C.insta_no, C.card_id FROM Checkout C NATURAL JOIN Media M WHERE M.lib_id = '${params['lib_id']}'`,
	[{ table: 'Checkout' }, {table: 'Media'}]
    );
})

Meteor.publish('reservedAtLib', function(params){
    return liveDb.select(
	`SELECT ISBN, insta_no, card_id FROM Reserve WHERE dest_lib = '${params['dest_lib']}'`,
	[{ table: 'Reserve' }]
    );
})

Meteor.methods({
    'insertCheckout': function(ISBN, insta_no, card_id, checkdate){
	liveDb.db.query(
	    'INSERT INTO Checkout SET ISBN = ?, insta_no = ?, card_id = ?, dateout = ?', [ISBN, insta_no, card_id, checkdate]);
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
