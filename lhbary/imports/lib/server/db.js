var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })

Meteor.publish('cardholder_info', function(card_id) {
    if (!card_id) {
        return;
    }
    
    return liveDb.select(
        `SELECT * FROM Cardholder WHERE card_id="${card_id}"`,
        [{ table: 'Cardholder' }]
    );
});

Meteor.publish('books_checked_out', function(card_id) {
    if (!card_id) {
        return;
    }
    return liveDb.select(
        `SELECT * FROM Checkout NATURAL JOIN (SELECT ISBN, insta_no, title FROM Media) T WHERE card_id="${card_id}"`,
        [{ table: 'Checkout' }, { table: 'Media' }]
    );
});
1
Meteor.publish('books_reserved', function(card_id) {
    if (!card_id) {
        return;
    }
    return liveDb.select(
        `SELECT * from (Reserve NATURAL JOIN (SELECT ISBN, insta_no, title FROM Media) T) JOIN (SELECT lib_id, lib_name FROM Library) U ON lib_id=dest_lib WHERE card_id="${card_id}"`,
        [{ table: 'Reserve' }, { table: 'Media' }, { table: 'Library' }]
    );
});

Meteor.methods({
    'cancelReservation': function(isbn, insta_no, card_id) {
        liveDb.db.query('DELETE FROM Reserve WHERE ISBN="${isbn}" AND insta_no="${insta_no}" AND card_id="${card_id}"');
    },

    'renewCheckout': function(isbn, insta_no, card_id) {
        liveDb.db.query('UPDATE Checkout SET renewals=renewals+1 WHERE ISBN="${isbn}" AND insta_no="${insta_no}" AND card_id="${card_id}"');
    },
})

export default liveDb;

// Closing connections between hot code-pushes
// as per https://github.com/numtel/meteor-mysql#closing-connections-between-hot-code-pushes
var closeAndExit = function() {
    liveDb.end();
    process.exit();
};
process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);
