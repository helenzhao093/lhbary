var mysql = require('mysql');

var liveDb = new LiveMysql(Meteor.settings.mysql);

/* Working publication template */
// Meteor.publish('test', function(params) {
//     return liveDb.select(
//         `SELECT * FROM Library WHERE lib_id='${params['lib_id']}`,
//         [{ table: 'Library' }]
//     );
// })

export default liveDb;

// Closing connections between hot code-pushes
// as per https://github.com/numtel/meteor-mysql#closing-connections-between-hot-code-pushes
var closeAndExit = function() {
    liveDb.end();
    process.exit();
};
process.on('SIGTERM', closeAndExit);
process.on('SIGINT', closeAndExit);
