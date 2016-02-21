Template.signup.onCreated(function(){
    Session.set('currentTab','signupForm');
});

Template.signup.onRendered(function(){
    if(Meteor.user()){
        Router.go('/'); // It will cause redirect bug if putting it in router
    }
});

Template.signup.events({
    'click #at-signIn': function (event, template){
        event.preventDefault();
        event.stopPropagation();
        Session.set('currentTab', 'signinForm');
    },
    'click #at-signUp': function (event, template){
        event.preventDefault();
        event.stopPropagation();
        Session.set('currentTab', 'signupForm');
    }
});

Template.signup.helpers({
    currentTab: function(){
        return Session.get('currentTab');
    }
});

Template.signup.onDestroyed(function(){
    Session.set('currentTab', undefined);
});

Template.signupForm.onRendered(function(){
    $("label[for='at-field-userType-choice-storeOwner']").css('margin-bottom','20px');
    $('#at-field-userType-choice-driver').attr('checked', true);
});

