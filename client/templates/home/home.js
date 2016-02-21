Template.home.onRendered(function(){
    $('.parallax').parallax();
    $('select').material_select();
    $(".button-collapse").sideNav();
    $('.slider').slider({full_width: true});
    $('ul.tabs').tabs();
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
    $('.search-result').css('display','none');
    $(window).bind('scroll', function() {
        var navHeight = 550;
        if ($(window).scrollTop() > navHeight) {
            $('.home-nav').css('position','fixed');
            $('.home-nav').css('top','0');
            $('.home-nav').css('z-index','9');
            $('.home-nav').css('transition-duration','0.5s');
            $('.home-nav').css('box-shadow','0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)');
            $('.home-nav .nav-wrapper').addClass('grey lighten-5');
        }
        else {
            $('.home-nav').css('position','relative');
            $('.home-nav').css('top','0');
            $('.home-nav').css('box-shadow','0 -20px 30px 0 rgba(0,0,0,0.16),0 0px 0px 0 rgba(0,0,0,0.12)');
            $('.home-nav .nav-wrapper').removeClass('grey lighten-5');
        }
    });
});

Template.home.events({
    'click #logout': function (event, template){
        event.preventDefault();
        event.stopPropagation();
        AccountsTemplates.logout();
    },
    'click #login': function (event, template){
        event.preventDefault();
        event.stopPropagation();
        $('#modal1').openModal();
    },
    'click #at-signUp': function (event, template){
        event.preventDefault();
        event.stopPropagation();
        $('#modal1').closeModal();
        Router.go('/signup');
    }
});


