import { Template } from 'meteor/templating';
import './error.html';

Template.Error.events({
    'click #backToCheckout'(event){
	event.preventDefault();
	FlowRouter.go("/checkout");
    }
});
