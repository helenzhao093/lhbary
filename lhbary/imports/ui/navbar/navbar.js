import './navbar.html';
import './navbar.css';

Template.Navbar.onRendered(function() {
    Tracker.autorun(function() {
        var route = FlowRouter.getRouteName();
        $(`.nav-link.active`).removeClass('active');
        $(`span.sr-only`).remove();

        $(`.nav-link#${route}`).addClass('active');
        $(`nav-link.active`).prepend(`<span class="sr-only">(current)</span>`);
    });
});

Template.Navbar.events({
    'click .nav-item'(event) {
        event.preventDefault();
        FlowRouter.go(event.currentTarget.id);
    }
});
