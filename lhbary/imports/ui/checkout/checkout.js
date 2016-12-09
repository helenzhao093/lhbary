import { Template } from 'meteor/templating';

import './checkout.html';

Template.Checkout.events({
    'submit .Checkout': function(){
	event.preventDefault();

	const target = event.target;
	const cardid = target.cardid.value;
	const ISBN = target.ISBN.value;
	const instance = target.instance.value;
	
	Meteor.call('insertCheckout', ISBN, instance, cardid);
	console.log("Submitted");
//	db.Post.insert([
//	    {
//	    ISBN: text
//	    insta_no:""
//	    card_id:""
//	}
//    ])
    }
});
