Template.homestores.onRendered(function(){
    var query = Router.current().params.query;
    Meteor.call("getTopStores", function(err, res){
        if(err){
            console.log(err);
        }
        else{
            console.log(res);
            Session.set("searchResult",res);
        }
    });
    $('select').material_select();
});

Template.homestores.helpers({
    services: function(){
      return consts.findOne().constValue;
    },
    result: function(){
        return Session.get('searchResult');
    }
})

Template.homestores.events({
    "click .btnStoreDetail":function(event){
        Router.go('/storeDetail/' + this._id);
    }
})
