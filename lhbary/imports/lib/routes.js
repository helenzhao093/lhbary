import './at_config.js';
import '../ui/layout.js';
import '../ui/home/home.js';
import '../ui/login/login.js';
import '../ui/admindash/admindash.js';
import '../ui/checkout/checkout.js';
import '../ui/confirm/confirm.js';
import '../ui/error/error.js';
import '../ui/search/search.js';
import '../ui/search_results/results.js';
import '../ui/notFoundPage/notFoundPage.js';

//Home page
FlowRouter.route('/', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Home'});
    },
    name: 'home',
});

//Search page
FlowRouter.route('/search', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Search'});
    },
    name: 'search',
});

//Search results
FlowRouter.route('/search_results', {
    action: function(params, queryParams) {
        BlazeLayout.render('App_layout', {main: 'Search_results'});
    },
    name: 'search_results',
});

//Dashboard
FlowRouter.route('/dashboard', {
    triggersEnter: [AccountsTemplates.ensureSignedIn],
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Dashboard'});
    },
    name: 'dashboard',
});

//Checkout
FlowRouter.route('/checkout', {
    action: function() {
        BlazeLayout.render('App_layout', {main: 'Checkout'});
    },
    name: 'checkout',
});

FlowRouter.route('/confirm', {
    action: function() {
	BlazeLayout.render('App_layout', {main: 'Confirm'});
    },
    name: 'confirm',
});

FlowRouter.route('/error', {
    action: function() {
	BlazeLayout.render('App_layout', {main: 'Error'});
    },
    name: 'error',
});

//Login page
// FlowRouter.route('/login', {
//     action: function() {
//         BlazeLayout.render('App_layout', {main: 'Login'});
//     },
//     name: 'login',
// });

AccountsTemplates.configureRoute('signIn', {
    layoutType: 'blaze',
    name: 'login',
    path: '/login',
    layoutTemplate: 'App_layout',
    layoutRegions: {},
    contentRegion: 'main',
    redirect: '/dashboard',
});

// 404 page
FlowRouter.route('/notFoundPage', {
    action: function() {
	BlazeLayout.render('App_layout', {main: 'notFoundPage'});
    },
    name: 'notFoundPage',
});

FlowRouter.notFound = {
    action: function() {
	FlowRouter.go('/notFoundPage');
    }
};
