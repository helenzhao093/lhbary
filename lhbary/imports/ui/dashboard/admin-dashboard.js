import { Template } from 'meteor/templating';

import './admin-dashboard.html';

Template.index.onCreated(function() {
    var user = Session.get('user');
    this.currentTab = new ReactiveVar();
    this.libname = new MysqlSubscription('lib_name');
    this.library = new MysqlSubscription('libraryInfo', user.username);
    this.checkedOut = new MysqlSubscription('checkoutMedia', { lib_id: user.username});
    this.reserve = new MysqlSubscription('reservedAtLib', { dest_lib: user.username});
    
});

//Tracker.autorun( function(){
//    if (Meteor.user()){
//	library.change({lib_id: Meteor.users.findOne( {_id : Meteor.user() } ).username });
//    }
//});

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

	return data[tab];
    },
    
    libname: function(){
	return [{"lib_name":"Discovery Library", "lib_id": "NTB6424"}, {"lib_name":"Harmony Library", "lib_id": "GPQ8503"}, {"lib_name":"Knight Library", "lib_id": "ZTJ7241"}, {"lib_name":"Marvel Library", "lib_id": "ODS9810"},{"lib_name":"National Memorial Library", "lib_id": "WNV0557"}, {"lib_name":"Plainfield Library", "lib_id": "STN2728"}, {"lib_name":"Public Scientific Library", "lib_id": "SDE4527"}, {"lib_name":"Serenity Library", "lib_id": "ZWN1658"}, {"lib_name":"Virtue Library", "lib_id": "PCY5040"}, {"lib_name":"Wonder Library", "lib_id": "ACX0125"}];
    }
});

Template.index.events({
    'click .nav-pills li': function( event, template ) {
	var currentTab = $( event.target ).closest( "li" );

	currentTab.addClass( "active" );
	$( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

	template.currentTab.set( currentTab.data( "template" ) );
    },
    'click .librarySelect': function(event){
	var id = event.target.id; 
	Template.instance().library.change(id);
	Template.instance().checkedOut.change(id);
	Template.instance().reserve.change(id);
    }
});

Template.goToCheckout.events({
    'click #checkout'(event){
	event.preventDefault();
	FlowRouter.go("/checkout");
    }
});
