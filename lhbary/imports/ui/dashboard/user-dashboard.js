import { Template } from 'meteor/templating';

import './user-dashboard.html';

Template.user_dashboard.onCreated(function() {
    var user = Session.get('user');
    this.currentTab = new ReactiveVar();
    this.account = new MysqlSubscription('cardholder_info', user.username);
    this.checkedOut = new MysqlSubscription('books_checked_out', user.username);
    this.reserved = new MysqlSubscription('books_reserved', user.username);
    this.currentTab.set('account');
});

Template.user_dashboard.helpers({
    currentTab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function() {
	      var tab = Template.instance().currentTab.get()
	      return Template.instance()[tab];
    },
});

Template.user_dashboard.events({
    'click .nav-pills li': function( event, template ) {
	      var currentTab = event.currentTarget;

	      $( currentTab ).addClass( "active" );
	      $( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

	      Template.instance().currentTab.set(currentTab.id);
    },
});

Template.account.helpers({
    email: function() {
        return !!Meteor.user().email ? Meteor.user().email : "No email on file";
    },
})

Template.checkedOut.helpers({
    dateout: function() {
        return Template.currentData().dateout.toLocaleDateString();
    },
    expiry: function() {
        return Template.currentData().expiry.toLocaleDateString();
    },
});

Template.renew_button.helpers({
    style: function() {
        if (Template.currentData().renewals < 3) {
            return 'btn-primary';
        } else {
            return 'btn-danger';
        }
    },
    renewals_left: function() {
        return 2 - Template.currentData().renewals;
    },
});

Template.renew_button.events({
    'click button.renew': function(event) {
        var isbn = Template.currentData().isbn;
        var insta_no = Template.currentData().insta_no;
        var card_id = Template.currentData().card_id;
        
        Meteor.call('renewCheckout', isbn, insta_no, card_id, function(error, results) {
            if (!error) {
                $(event.currentTarget).removeClass('btn-primary');
                $(event.currentTarget).addClass('btn-success');
                event.currentTarget.innerHTML = "Success!";
            } else {
                $(event.currentTarget).removeClass('btn-success');
                $(event.currentTarget).addClass('btn-danger');
                event.currentTarget.innerHTML = "Unable to renew!";
                FlowRouter.go('/notFoundPage');
            }
        });
        Template.currentData().expiry.setDate(Template.currentData().expiry + 21);
        Template.currentData().renewals += 1;
    }
});

Template.cancel_button.events({
    'click button.cancel': function(event) {
        var isbn = Template.currentData().isbn;
        var insta_no = Template.currentData().insta_no;
        var card_id = Template.currentData().card_id;

        Meteor.call('cancelReservation', isbn, insta_no, card_id, function(error, results) {
            $(event.currentTarget.closest('tr')).remove();

        }
                   );
    }
});

Template.reserved.helpers({
    expiry: function() {
        if (!!Template.currentData().expiry) {
            return expiry.toLocaleDateString();
        } else {
            return "Indefinite";
        }
    }
});
