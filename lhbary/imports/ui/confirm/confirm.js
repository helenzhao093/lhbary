import { Template } from 'meteor/templating';
import './confirm.html';

Template.Confirm.onCreated(function(){
    var cardid = FlowRouter.getQueryParam('cardid');
    var ISBN = FlowRouter.getQueryParam('ISBN');
    var instance = FlowRouter.getQueryParam('instance');
});

Template.Confirm.events({
    'click #checkout'(event){
	event.preventDefault();
	FlowRouter.go("/checkout");
    }
});

Template.Confirm.helpers({
    confirmaton: function(){
	return [{
	    "cardid": this.cardid,
	    "ISBN": this.ISBN,
	    "instance": this.instance
	}];
    }
});
