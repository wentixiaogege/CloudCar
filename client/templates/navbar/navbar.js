Template.navbar.onRendered(function(){
    $(".button-collapse").sideNav({
        //menuWidth: 300, // Default is 240
        //edge: 'right', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    $('.my-stores').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
});

Template.navbar.events({
    'click #logout':function(event, template) {
        event.preventDefault();
        event.stopPropagation();
        AccountsTemplates.logout();
    },
    'click #login':function(event, template) {
        event.preventDefault();
        event.stopPropagation();
        $('#modal1').openModal();
    },
    'click #at-signUp':function (event, template){
        event.preventDefault();
        event.stopPropagation();
        $('#modal1').closeModal();
        Router.go('/signup')
    }
});

Template.storeList.onRendered(function(){

});

Template.storeList.helpers({
   stores: function(){
       return Meteor.user().profile.myStores;
   }
});

Template.storeListSide.helpers({
    stores: function(){
        return Meteor.user().profile.myStores;
    }
});
