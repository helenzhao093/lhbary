import './dashboard.html';
import './admin-dashboard.js';
import './user-dashboard.js';

Template.Dashboard.helpers({
    dashtype: function() {
        if(Session.get('user').profile) {
            return 'admin_dashboard';
        } else {
            return 'user_dashboard';
        }
    }
})
