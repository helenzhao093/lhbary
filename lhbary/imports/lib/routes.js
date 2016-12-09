import '../ui/layout.js';
import '../ui/home/home.js';
import '../ui/search/search.js';
import '../ui/search_results/results.js';


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
FlowRouter.route('/search_results/:query', {
    action: function(params, queryParams) {
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
