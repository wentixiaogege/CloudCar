AccountsTemplates.configure({
    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: false,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: function(error, state){
        Router.go('/');
    },
    onSubmitHook: function(error, state){
        if (!error) {
            if (state === "signIn") {
                // Successfully logged in
                if(Router.current().route._path == '/signup'){
                    Router.go('/');
                }else{
                    $('#modal1').closeModal();
                }
            }
            if (state === "signUp") {
                // Successfully registered
                if(Session.get('userType') == 'driver'){
                    Router.go('/usercenter');
                }else{
                    Router.go('/register');
                }
            }
        }else{
            console.log(error.message);
        }
    },
    preSignUpHook: function(password, doc){
        if(doc.profile.userType == 'driver'){
            Session.set('userType','driver');
        }else{
            Session.set('userType','store');
        }
    },

    // Texts
    texts: {
        button: {
            signUp: "Create Account"
        },
        signUpLink_link: "Sign Up",
        socialSignUp: "Register",
        socialIcons: {
            "meteor-developer": "fa fa-rocket"
        },
        title: {
            signUp: '',
            signIn:'',
            forgotPwd: "Forgot Password"
        }
    }
});

AccountsTemplates.addField({
    _id: 'userType',
    displayName: 'User Type',
    type: 'radio',
    value: 'driver',
    required: true,
    select: [
        {
            text: "Driver",
            value: "driver"
        }, {
            text: "Store Owner",
            value: "storeOwner"
        }
    ],
    negativeValidation: true,
    negativeFeedback: true,
    errStr: 'required yo'
});