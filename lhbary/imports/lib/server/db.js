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
