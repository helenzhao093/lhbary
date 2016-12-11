// Add to active page
// <span class="sr-only">(current)</span>
import './navbar.html';

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
    'click .nav-link'(event) {
        event.preventDefault();
        FlowRouter.go(event.target.id);
    }
});
