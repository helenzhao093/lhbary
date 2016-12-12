import { Template } from 'meteor/templating';

import './checkout.html';


Template.Checkout.events({
    'submit .add_media': function(event){
	event.preventDefault();

	const target = event.currentTarget;
	const cardid = target.cardid.value;
	const ISBN = target.ISBN.value;
	const instance = target.instance.value;
	var date = new Date();
	date = moment(date).format('YYYY-MM-DD hh:mm:ss');

	Meteor.call('insertCheckout', ISBN, instance, cardid, date, function (error, result) {
	    if (error){
		FlowRouter.go("/error") ;
	    }
	    else{
		var path = FlowRouter.path('/confirm', {}, {cardid: cardid, ISBN: ISBN, instance: instance}
					  )}
		FlowRouter.go(path);
	    }
		   )
    }
});
