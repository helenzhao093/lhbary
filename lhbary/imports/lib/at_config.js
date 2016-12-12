AccountsTemplates.configure({
    forbidClientAccountCreation: true,
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
