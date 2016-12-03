import '../ui/layout.js';

import '../ui/home/home.js';


//Home page
FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Home'});
    }
});

//Search page
FlowRouter.route('/search', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Search'});
    }
});

//Search results
FlowRouter.route('/search_results', {
    action: function(params, queryParams) {
        //TODO: How do we get the data from the server to the client2
        //Picker? https://github.com/meteorhacks/picker
        BlazeLayout.render('App_layout', {main: 'Search_results'});
    }
});

//Dashboard
FlowRouter.route('/dashboard', {
    //TODO: Logged-in logic
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Dashboard'});
    }
});

//Checkout
FlowRouter.route('/checkout', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Checkout'});
    }
});

//Login page
FlowRouter.route('/login', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Login'});
    }
});
