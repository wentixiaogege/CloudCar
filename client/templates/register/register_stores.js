var registerError;
Session.set('registerStatus', -10);

Template.registerStores.onRendered(function(){
    GoogleMaps.load();
})
Template.registerStores.events({
    'click [data-action = storeRegister]': function(event, target){
        //perevent the defualt behaviour of form submitting
        event.preventDefault();
        var storeName = target.find('#storeName').value;
        var licenceNo = target.find('#licenceNo').value;
        var state = target.find('#state').value;
        var city = target.find('#city').value;
        var streetAddress = target.find('#streetAddress').value;
        //var email = target.find('#email').value;
        var phoneNumber = target.find('#phoneNumber').value;
        phoneNumber = Phoneformat.formatLocal('US', phoneNumber);

        Meteor.call('register', licenceNo, state, city, streetAddress,storeName, phoneNumber, function(err, result){
            if(err){
                Session.set('registerStatus', -2);
                alert("Fail");
            }
            else {
                if (result) {
                    alert("Application submit, Please wait");
                    Router.go('/');
                }
                else{
                    alert("store exist");
                }
            }
        })
        //Meteor.call('getLatLng',streetAddress,city, state, function(err, location){
        //    if(err){
        //        Session.set('registerStatus', -2);
        //    }
        //    else{
        //        var latLng = [location.longitude,location.latitude];
        //
        //    }
        //})


        //Meteor.call("storeRegister",email, licenceNo, state, city, streetAddress, storeName,phoneNumber, function(err, callback){
        //    Session.set('registerStatus', callback);
        //    if (callback == 0)
        //        Router.go('/login');
        //});

    },
    'blur .inputLocation':function(){
        var state = $('#state').val();
        var city = $('#city').val();
        var streetAddress = $('#streetAddress').val();
        if(state && city && streetAddress){
            Meteor.call('getLatLng',streetAddress,city, state, function(err, location) {
                if (err) {
                    alert("error");
                }
                else{
                    var mapOptions = {
                        zoom: 13,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        zoomControl: true,
                        streetViewControl: false,
                        scaleControl: false,
                        mapTypeControl: false
                    };
                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    var centerLat = location.latitude;
                    var centerLng = location.longitude;
                    var Latlng = new google.maps.LatLng(centerLat, centerLng);
                    //var infowindow = new google.maps.InfoWindow({
                    //    content: "<a href='/store_detail/"+store.id+"'>"+store.name+"</a><br /><img src='"+store.rating_img_url+"' />"
                    //});
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(centerLat, centerLng),
                        map: map,
                        title: 'Auto Service Store'
                    });
                    //google.maps.event.addListener(marker, 'click', function() {
                    //    infowindow.open(map,marker);
                    //});
                    //google.maps.event.addListener(marker, 'mouseout', function() {
                    //    infowindow.close(map,marker);
                    //});
                    map.setCenter(Latlng);
                }
            });


        }
    }
});

Template.registerStores.helpers({
    registerStatus: function(){
        switch(Session.get('registerStatus')){
            case -2:
                return "Server Error";
            case -1:
                return "There is a store with exactly the same licenceNo";
            case 0:
                return "correct";
            default:
                return "";
        }
    }
});