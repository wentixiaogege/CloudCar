Template.infoLayout.onRendered(function(){
    if ($(this).scrollTop() < 200) {
        $('#anchor-to-catalog').hide();
    }
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('#anchor-to-catalog').fadeIn(200);
        } else {
            $('#anchor-to-catalog').fadeOut(200);
        }
    });
});

Template.infoLayout.events({
    'click a[href^=#]':function(event, template){
        var target = $(event.target).parent().attr('href') ;
        if( target.length ) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top-80
            }, 500);
        }
    }
});
