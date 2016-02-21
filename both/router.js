Router.configure({
    loadingTemplate: 'loading'
});

Router.onBeforeAction(function(pause) {
    if(Router.current().route._path != '/usercenter'){
        $(window).scrollTop(0);
        $('.button-collapse').sideNav('hide');
    }
    this.next();
});

Router.route('/',{
    waitOn: function(){
        return Meteor.subscribe('consts','services');
    },
    action: function(){
        this.layout('homeLayout');
        this.render('home');
    }
   
});

Router.route('/loading',{
    action: function(){
        this.render('loading');
    }
});

Router.route('/signup',{
    action: function(){
            this.layout('homeLayout');
            this.render('signup');
    }
});

//Router.route('/result',{
//   action:function(){
//       this.layout('layout');
//       this.render('result');
//   }
//});
/* user center */
Router.route('/usercenter',{
    onBeforeAction: function(){
        if(Meteor.user()) {
            this.next();
        }else{
            this.render('403');
        }
    },
    data: function(){
        return {
            trans: transactions.find({},{sort:{paid:1}})
        }
    },
    waitOn: function(){
      return [Meteor.subscribe('getAvatar'), Meteor.subscribe('checkActiveReq')];
    },
    action: function(){
        this.layout('layout');
        this.render('userCenter');
    }
});
/* user center */
/* store center */
Router.route('/storecenter',{
    action: function(){
        this.layout('layout');
        this.render('storeCenter');
    }
});
/* user center */
/* Static Pages */
Router.route('/about',{
    action: function(){
        this.layout('infoLayout');
        this.render('about');
    }
});
//Router.route('/careers',{
//    action: function(){
//        this.layout('infoLayout');
//        this.render('careers');
//    }
//});
Router.route('/driver-faq',{
    action: function(){
        this.layout('infoLayout');
        this.render('driverFaq');
    }
});
Router.route('/store-faq',{
    action: function(){
        this.layout('infoLayout');
        this.render('storeFaq');
    }
});
Router.route('/guidelines',{
    action: function(){
        this.layout('infoLayout');
        this.render('guidelines');
    }
});
Router.route('/policy',{
    action: function(){
        this.layout('infoLayout');
        this.render('policy');

    }
});
Router.route('/why-carvicer',{
    action: function(){
        this.layout('infoLayout');
        this.render('whyCarvicer');
    }
});
/* Static Pages END */

/*search*/
Router.route('/search', {
    waitOn: function(){
        return Meteor.subscribe('consts','services');
    },
    action: function() {
        this.layout("layout");
        this.render('search');
    }
});

Router.route('/storeDetail/:_id', {
    waitOn: function(){
        Meteor.subscribe('getStoreDetail', this.params._id);
    },
    data: function(){
        return { thisStore: stores.findOne() };
    },
    action: function() {
        Session.set("sId",this.params._id);
        this.layout("layout");
        this.render('storeDetail');
    }
    //data:function(){
    //    return this.params;
    //}
});
Router.route('/storeDetail/:_id/admin', {
    waitOn: function(){
        Meteor.subscribe('consts');
        Meteor.subscribe('getStoreDetail', this.params._id);
        Meteor.subscribe("getRequests", Router.current().params._id);
        Meteor.subscribe("getOffers", Router.current().params._id);
        Meteor.subscribe('getStoreTrans', Router.current().params._id);
    },
    data: function(){
        return { thisStore: stores.findOne() };
    },
    action: function() {
        //this.render('403');
        var self = this;
        Meteor.call('getStore', this.params._id, function(err, res){
            if(err || res != true){
                self.render('403');
            } else{
                self.layout("layout");
                self.render('storeCenter');
            }
        });
        //let isStoreOwner = Meteor.call('getStore', this.params._id);
        //if(isStoreOwner == true){
        //    this.next();
        //}else{
        //    this.render('403');
        //}
        //if(this.ready()) {
        //
        //}else{
        //
        //}
    }
    //data:function(){
    //    return this.params;
    //}
});
/*end of search*/

/*register*/
Router.route('/register',{
    onBeforeAction: function(){
        if(Meteor.user()) {
            this.next();
        }else{
            this.render("signup");

        }
    },
    action:function(){

        //need to verify user has login or not
        this.layout('layout');
        this.render('registerStores');
    }
});
/*end of register*/

Router.route('/signupSuccess',{
    onBeforeAction: function(){
        if(Meteor.user()) {
            this.next();
        }else{
            this.layout('homeLayout');
            this.render("home"); // in case
        }
    },
    action:function(){

        //need to verify user has login or not
        this.layout('layout');
        this.render('signupSuccess');
    }
});