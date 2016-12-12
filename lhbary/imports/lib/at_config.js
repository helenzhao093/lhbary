AccountsTemplates.configure({
    forbidClientAccountCreation: true,
    onLogoutHook: function() {
        Session.set('username', undefined);
        FlowRouter.go('home');
    },
    onSubmitHook: function(error, state) {
        if (state === 'signIn') {
            var p1 = new Promise(function (resolve, reject) {
                if (Meteor.user()) {
                    resolve(Meteor.user());
                }
            });
            p1.then(function(user) {
                Session.setPersistent('user', user);
            });
        }
    },
    texts: {
        navSignIn: "Log In",
        navSignOut: "Log Out",
    },
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: 'username',
        type: 'text',
        displayName: 'username',
        required: true,
    },
    pwd
]);
