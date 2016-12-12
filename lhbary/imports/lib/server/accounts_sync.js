import liveDb from './db.js';

const default_password = 'password';

Meteor.methods({
    'test': function() {
        console.log('test string');
    },

    'sync_cardholder_accounts': function() {
        var promised_card_ids = new Promise(function(resolve, reject) {
            liveDb.db.query(
                `SELECT card_id FROM Cardholder`,
                function (error, results, fields) {
                    resolve(results);
                }
            );
        });
        promised_card_ids.then(function(results) {
            results.forEach(function (row) {
                var card_id = row.card_id;
                if(!Meteor.users.find({ username: card_id }).count()) {
                    Accounts.createUser({
                        username: card_id,
                        password: default_password,
                    });
                }
            });
        });
    },

    'sync_library_accounts': function() {
        var promised_card_ids = new Promise(function(resolve, reject) {
            liveDb.db.query(
                `SELECT lib_id FROM Library`,
                function (error, results, fields) {
                    resolve(results);
                }
            );
        });
        promised_card_ids.then(function(results) {
            results.forEach(function (row) {
                var lib_id = row.lib_id;
                if(!Meteor.users.find({ username: lib_id }).count()) {
                        Accounts.createUser({
                            username: lib_id,
                            password: default_password,
                            profile: {library: true}
                        });
                    }
            });
        });
    },
});
