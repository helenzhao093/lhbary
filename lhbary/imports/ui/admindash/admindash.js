import { Template } from 'meteor/templating';

import './admindash.html';

Template.index.onCreated( function() {
    this.currentTab = new ReactiveVar();
    this.library =  new MysqlSubscription('libraryInfo', {lib_id: "" });
    this.checkedOut = new MysqlSubscription('checkoutMedia', { lib_id: 'ACX0125'});
    this.reserve = new MysqlSubscription('reservedAtLib', { dest_lib: 'ACX0125' });
});

Template.index.onRendered( function(){
    if (Meteor.user() && this.userRequesting._id == Meteor.user()._id){
    this.library.change({lib_id: Meteor.users.findOne( {_id : Meteor.userId()} ).username });
    }
});
Template.index.helpers({
    tab: function() {
	return Template.instance().currentTab.get();
    },
    tabData: function() {
	var tab = Template.instance().currentTab.get();

	var data = {
	    "Library Information": Template.instance().library,
	    "Media Checked Out": Template.instance().checkedOut,
	    "Media Reserved At Library": Template.instance().reserve
	};

	return data[ tab ];
    }
});

Template.index.events({
    'click .nav-pills li': function( event, template ) {
	var currentTab = $( event.target ).closest( "li" );

	currentTab.addClass( "active" );
	$( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

	template.currentTab.set( currentTab.data( "template" ) );
    }
});

