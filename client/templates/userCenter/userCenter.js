Template.userCenter.onRendered(function(){
    $('.button-collapse').sideNav('hide');
    Meteor.call('getReward', function(err, reward){
       if(err){
            $('.user-reward').append('0');
       } else{
           $('.user-reward').append(reward);
       }
    });

    Session.set('userCenterCurrentTab', 'viewHistory');
});


Template.userCenter.helpers({
    currentTab: function(){
        var currentTab = Session.get('userCenterCurrentTab');
        if(currentTab == 'viewHistory') return 'viewHistory';
        if(currentTab == 'addPayment') return 'addPayment';
        if(currentTab == 'editInfo') return 'editInfo';
    },
    avatar: function(){
        return Images.findOne(Meteor.user().profile.avatar);
    },
    activeReq: function(){
        return orders.findOne();
    }
});

Template.userCenter.events({
   "click #view-history": function(event, template){
       Session.set('userCenterCurrentTab', 'viewHistory');
   },
    "click #add-payment": function(event, template){
        Session.set('userCenterCurrentTab', 'addPayment');
    },
    "click #edit-info": function(event, template){
        Session.set('userCenterCurrentTab', 'editInfo');
    }
});

Template.userCenter.onDestroyed(function(){
    Session.set('userCenterCurrentTab', undefined);
});

Template.viewHistory.onRendered(function(){
    Meteor.subscribe("getTrans");
});

Template.viewHistory.helpers({
   //trans: function(){
   //    return transactions.find({},{sort:{paid:1}});
   //}
});

Template.addPayment.onRendered(function(){
    $('input.cc-num').payment('formatCardNumber');
    $('input.cc-cvc').payment('formatCardCVC');
    $('input.cc-exp').payment('formatCardExpiry');
    Meteor.call('retrieveCardList',function(err,cards){
        if(err){
            console.log(err.message);
        }else{
            Session.set('userCards',cards.data);
        }
    });
});

Template.addPayment.events({
    "click #save_card": function(){
        Session.set("isLoading",true);
        Stripe.card.createToken({
            number: $('.cc-num').val(),
            cvc: $('.cc-cvc').val(),
            name: $('.cc-name').val(),
            exp_month: $('.cc-exp').payment('cardExpiryVal').month,
            exp_year: $('.cc-exp').payment('cardExpiryVal').year,
            address_zip: $('.cc-zip').val()
        },function(status,res){
            if(res.error){
                alert(res.error.message);
            }
            else{
                Meteor.call("createCard",res.id, Meteor.user().emails[0].address ,function(err,res){
                    Session.set("isLoading",false);
                    if(err){
                        alert(err.reason);
                    }
                    else{
                        $('.cc-num').val('');
                        $('.cc-cvc').val('');
                        $('.cc-name').val('');
                        $('.cc-zip').val('');
                        Meteor.call('retrieveCardList',function(err,cards){
                            Session.set('userCards',cards.data);
                        });
                    }
                });
            }
        });
    },
    "click .delete_card": function(){
        Meteor.call("deleteCard", this.id, function(err, res){
            if(err){
                console.log(err.message);
            }else{
                Meteor.call('retrieveCardList',function(err,cards){
                    Session.set('userCards',cards.data);
                });
            }
        });

    }
});

Template.addPayment.helpers({
    cards: function(){
        return Session.get('userCards');
    }
});

Template.editInfo.events({
    "click #save_avatar": function(event, template){

    },
    "click #save_info": function(event, template){
         Meteor.users.update(Meteor.userId(), {$set: {"profile.firstName": template.find('#first_name').value,
         											"profile.lastName": template.find('#last_name').value,
         											"profile.phone": template.find('#phone').value,
         }}, function(err, res){
             if(err){
                 alert(err.message);
             }else{
                 alert('Saved!');
             }
         });
    },
    "change #choose_make": function (){
        if($('#choose_make').val() != ""){
            $('#choose_model').prop('disabled',true);
            $('#choose_year').prop('disabled',true);
            HTTP.call("GET", "https://api.edmunds.com/api/vehicle/v2/"+ $('#choose_make').val() +"?fmt=json&api_key=rnghyd2d5zp5p2gdpg2ppn5q", function(err, result){
                Session.set("modelList",result.data.models);
                $('#choose_model').val('');
                $('#choose_year').val('');
                $('#choose_model').prop('disabled',false);
            });
        }
    },
    "change #choose_model": function (){
        if($('#choose_model').val() != ""){
            $('#choose_year').prop('disabled',true);
            HTTP.call("GET", "https://api.edmunds.com/api/vehicle/v2/"+ $('#choose_make').val() +"/"+ $('#choose_model').val() +"?fmt=json&api_key=rnghyd2d5zp5p2gdpg2ppn5q", function(err, result){
                Session.set("yearList",result.data.years);
                $('#choose_year').val('');
                $('#choose_year').prop('disabled',false);
            });
        }
    },
    "click #add_car": function (){
        if($('#choose_make').val()!="" && $('#choose_model').val()!="" && $('#choose_year').val()!=""){
            var id=new Mongo.ObjectID();
            Meteor.users.update({_id: Meteor.userId()}, {
                $push:{ "profile.vehicles": {
                    "id": id.valueOf(),
                    "make": $('#choose_make option:selected').text(),
                    "model": $('#choose_model option:selected').text(),
                    "year": $('#choose_year option:selected').text()
                }
                }
            });
            $('#choose_make').val("");
            $('#choose_model').val("");
            $('#choose_year').val("");
            $('#choose_model').prop('disabled',true);
            $('#choose_year').prop('disabled',true);
        }
    },
    "click .delete_vehicle": function (event, template){
        // var vehicleId = this.id;
        // $("."+vehicleId).addClass('bounceOutRight');

        Meteor.users.update({_id: Meteor.userId()},{$pull:{ "profile.vehicles": { "id": this.id}}});
        // Meteor.setTimeout(function() {
        // 	Meteor.users.update({_id: Meteor.userId()},{$pull:{ "profile.vehicles": { "id": vehicleId}}});
        // }, 500,vehicleId);

    }
});

Template.editInfo.onRendered(function (){
    $('#choose_make').val("");
    $('#choose_model').val("");
    $('#choose_year').val("");
    $('#choose_model').prop('disabled',true);
    $('#choose_year').prop('disabled',true);

});

Template.editInfo.helpers({
    myVehicles: function(){
        return Meteor.user().profile.vehicles;
    },
    makes: function (){
        return Session.get("makeList");
    },
    models: function (){
        return Session.get("modelList");
    },
    years: function (){
        return Session.get("yearList");
    }
});