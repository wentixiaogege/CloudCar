Template.storeCenter.onRendered(function(){
    Session.set('storeCenterCurrentTab', 'requesting');

});

Template.storeCenter.helpers({
    currentTab: function(){
        return Session.get('storeCenterCurrentTab');
        //var currentTab = Session.get('storeCenterCurrentTab');
        //if(currentTab == 'requesting') return 'requesting';
        //if(currentTab == 'schedule') return 'schedule';
        //if(currentTab == 'storeViewHistory') return 'storeViewHistory';
        //if(currentTab == 'quotes') return 'quotes';
        //if(currentTab == 'myStore') return 'myStore';
        //if(currentTab == 'requestItemDetail') return 'requestItemDetail';
    },
    services: function(){
        return consts.findOne().constValue;
    }
});

Template.storeCenter.events({
    "submit #search-receipt-code, click #submit-search-code": function(event){
        event.preventDefault();
        Meteor.call('checkReceiptCode', $('#search-code').val(), function(err, res){
            if(err){
                alert(err.message);
            }
            else if(res == 'No such receipt code!'){
                alert(res);
            }else{
                Session.set('quoteId', res );
                Session.set('storeCenterCurrentTab', 'onGoingQuoteDetail');

            }
        });
    },
    "click #requesting": function(event, template){
        Session.set('storeCenterCurrentTab', 'requesting');
    },
    "click #schedule": function(event, template){
        Session.set('storeCenterCurrentTab', 'schedule');
    },
    "click #store-view-history": function(event, template){
        Session.set('storeCenterCurrentTab', 'storeViewHistory');
    },
    "click #quotes": function(event, template){
        Session.set('storeCenterCurrentTab', 'quotes');
    },
    "click #my-store": function(event, template){
        Session.set('storeCenterCurrentTab', 'myStore');
    },
    "click #btnAddService" :function(){
        var service = $("#selAddService").val();

        stores.update({});

    }
});

Template.storeCenter.onDestroyed(function(){
    Session.set('storeCenterCurrentTab', undefined);
});

Template.requesting.events({
    "click .req-detail": function(event, template){
        Session.set('currentReq', this._id);
        Session.set('storeCenterCurrentTab', 'requestItemDetail');
    }
});

Template.requesting.helpers({
    requests:function(){
        var orderList = orders.find();
        orderList = orderList.map(function(one){
            if(one){
                var time = one.expiredAt;
                time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
                var timeLeft = time.diff(moment(), "minutes");
                one.expiredTime = timeLeft;
            }
            else{
                one.expiredTime = "-Expired-";
            }
            return one;
        });
        return orderList;
    }
});

Template.requestItemDetail.onRendered(function(){
    $('#offer-sent').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            //ready: function() { alert('Ready'); }, // Callback for Modal open
            complete: function() {$('.lean-overlay').remove(); } // Callback for Modal close
        });
});

Template.requestItemDetail.events({
    "click .back-to-req-list, click #after-sent-offer": function(events){
        $('#offer-sent').closeModal();
        $('.lean-overlay').remove();
        Session.set('storeCenterCurrentTab', 'requesting');

    },
    'click [data-action = bidRequest]':function(event, template){
        var orderId = Session.get('currentReq');
        var price = $('#offer_price').val();
        var message = $('#message').val();
        Meteor.call("insertOffer", price, message, orderId, Router.current().params._id, function(err,callback){
            if (err)
                Session.set("alertMessage", "Something is wrong with the server");
            else if (callback == -2)
                Session.set("alertMessage", "Cannot submit quote twice");
            else if (callback == -1)
                Session.set("alertMessage", "This request has been expired");
            else if (callback == -3)
                Session.set("alertMessage", "Price must be number");
            else{
                Session.set("alertMessage", "");
                //$('#offer-sent').openModal();
                Session.set('storeCenterCurrentTab', 'quotes');
                console.log('1');
            }
        });
    }
});

Template.requestItemDetail.helpers({
    thisReq: function(){
        let reqId =  Session.get('currentReq');
        var order = orders.findOne(reqId);
        if(order){
            var time = order.expiredAt;
            time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
            var timeLeft = time.diff(moment(), "minutes");
            order.expiredTime = timeLeft;
        }
        else{
            order.expiredTime = "-Expired-";
        }
        return order;

    },
    errMessage: function(){
        return Session.get("alertMessage");
    }
});


Template.quotes.helpers({
    offersPending: function(){
        var offerList = offers.find({accepted: false}).map(function(one){

            //for expire time
            var req = orders.findOne(one.orderId);
            if(req){
                var time = req.expiredAt;
                time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
                var timeLeft = time.diff(moment(), "minutes");
                one.expiredTime = timeLeft;
            }
            else{
                one.expiredTime = "-Expired-";
            }
            return one;
        });



        return offerList;
    },
    offersOnGoing: function(){
        var offerList = offers.find({accepted: true}).map(function(one){

            //for expire time
            var req = orders.findOne(one.orderId);
            if(req){
                var time = req.expiredAt;
                time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
                var timeLeft = time.diff(moment(), "minutes");
                one.expiredTime = timeLeft;
            }
            else{
                one.expiredTime = "-Expired-";
            }
            return one;
        });



        return offerList;
    }
});

Template.quotes.onRendered(function () {
    $('ul.tabs').tabs();
    $('ul.tabs').tabs('select_tab', 'tab_id');

});
Template.quotes.events({
    "click .goPendingQuoteDetail": function(){
        Session.set('quoteId', this._id );
        Session.set('storeCenterCurrentTab','pendingQuoteDetail');
    },
    "click .goOnGoingQuoteDetail":function(){
        Session.set('quoteId', this._id );
        Session.set('storeCenterCurrentTab','onGoingQuoteDetail');
    }
});

Template.pendingQuoteDetail.helpers({
    thisQuote: function () {
        var id = Session.get('quoteId');
        var offer =  offers.findOne({_id:id});
        var req = orders.findOne(offer.orderId);

        //for expire time
        if(req){
            var time = req.expiredAt;
            time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
            var timeLeft = time.diff(moment(), "minutes");
            offer.expiredTime = timeLeft;
        }
        else{
            offer.expiredTime = "-Expired-";
        }


        return offer;
    },
});

Template.pendingQuoteDetail.events({
    "click .back-pending":function(){
        Session.set('storeCenterCurrentTab','quotes');
    },
    "click #update-quote-trigger": function (event, template) {
        $('#update-quote').openModal();
    },
    "click #btn-update-quote":function(){
        var id = Session.get('quoteId');
        var price = $("#txt-update-price").val();;
        var msg = $("#txt-update-msg").val();
        //call update
        Meteor.call("updateOffer",id, price, msg, function(err, result){
            if(result){
                //alert and return
                alert("update success");
                $('#update-quote').closeModal();
            }
            else{
                //err
                alert("update fail");
            }
        });
    },
    "click #close-update-modal": function(){
        $('#update-quote').closeModal();
    }
});

Template.onGoingQuoteDetail.events({
    "click .back-pending":function(){
        Session.set('storeCenterCurrentTab','quotes');
    },
    "click #btn-confirm":function(){
        var id = Session.get('quoteId');
        Meteor.call("addTrans",id, function(err, result){
           if(result){
               alert("confirm!");

           }else{
                alert("fail.");
           }
            }
        );
    }
});

Template.onGoingQuoteDetail.helpers({
     thisQuote: function() {
            var id = Session.get('quoteId');
            var offer =  offers.findOne({_id:id});
            var req = orders.findOne(offer.orderId);

            //for expire time
            if(req){
                var time = req.expiredAt;
                time = moment(time, "YYYY-MM-DD HH:mm:ss ZZ");
                var timeLeft = time.diff(moment(), "minutes");
                offer.expiredTime = timeLeft;
            }
            else{
                offer.expiredTime = "-Expired-";
            }
            return offer;
     },
    isConfirm:function(){
        var thisQuote = offers.findOne(Session.get('quoteId'));
        return thisQuote.canConfirm;
    }
});

Template.myStore.onRendered(function () {
    $('ul.tabs').tabs();
    $('ul.tabs').tabs('select_tab', 'tab_id');
    $('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});

Template.myStore.events({
   'submit #add-service': function(event){
       event.preventDefault();
       var id = new Mongo.ObjectID();
       Meteor.call("addService",stores.findOne()._id,id.valueOf(),$('#service').val(),$('#price').val(),"",function(err,result){

       });
   },
    'click .remove-service': function(event){
        Meteor.call("deleteService",stores.findOne()._id,this.id,function(err,result){

        });
    },
    'submit #add-staff': function(event){
        event.preventDefault();
        var email = $("#txt-email").val().toLowerCase();
        var name = $("#txt-name").val();
        Meteor.call("addAssistant",stores.findOne()._id,email,name,function(err,result){
            if(err){

            }
            if(result){
                $("#add-staff")[0].reset();
                alert("submit");
            }
        });
    },
    'submit #add-language': function(event){
        event.preventDefault();
        let language = $('#language').val();
        Meteor.call("addLanguage",stores.findOne()._id,language,function(err,result){
            if(err){

            }
            if(result){
                alert("new language:"+result);
            }
        });
    },
    'click .remove-language': function(event){
        event.preventDefault();
        var language = this.toString();
        Meteor.call("delLanguage",stores.findOne()._id,language,function(err,result){
            if(err){

            }
            if(result){
                alert("del language:"+result);
            }
        });
    }

});

Template.myStore.helpers({
    thisStore:function(){
        return stores.findOne();// dai
    },
    services: function(){
        return consts.findOne({constName:"services"}).constValue;
    },
    languages:function(){
        return consts.findOne({constName:"languages"}).constValue;
    }
    //staffList:function(){
    //    var store = stores.findOne();
    //    var staffList = Meteor.users.find({_id:store.assistantsId});
    //    staffList = staffList.map(function(one){
    //        var tmp = {};
    //        tmp.name = one.userName;
    //        tmp.email = one.emails[0].address;
    //        return tmp;
    //    });
    //    return staffList;
    //},
})

Template.storeViewHistory.helpers({
    trans: function(){
        return transactions.find();
    }
});

Template.storeViewHistory.events({
   'click .store-trans': function(event){
       Session.set('storeCenterCurrentTab','storeViewHistoryDetail');
       Session.set('storeHistoryId', this._id);
   }
});

Template.storeViewHistoryDetail.onRendered(function(){
    Session.set('thisTrans', transactions.findOne({_id: Session.get('storeHistoryId')}));
});

Template.storeViewHistoryDetail.events({
   'click .back-store-history': function(){
       Session.set('storeCenterCurrentTab','storeViewHistory');
   }
});

Template.storeViewHistoryDetail.helpers({
    thisTrans: function(){
        return Session.get('thisTrans');
    }
});