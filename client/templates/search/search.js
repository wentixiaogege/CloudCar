Template.search.onRendered(function(){
    var query = Router.current().params.query;
    Meteor.call("getSearch", query.city, query.service, function(err, res){
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

Template.search.helpers({
    services: function(){
      return consts.findOne().constValue;
    },
    result: function(){
        return Session.get('searchResult');
    }
})

Template.search.events({
    "click #test":function(){
        Meteor.call("test","abc",function(err, res){
            if(err){
                console.log(err);
            }
            else{
                console.log(res);

            }
        })
    },
    //"load #selService":function(){
    //    $("selService").firstChild.attr("selected",true);
    //},
    "click #btnSearch":function(){

        var city = $("#txtSearch").val();
        var service = $("#selService").val();

        city = city.toLocaleLowerCase();
        service = service.toLocaleLowerCase();
        city = city.trim();
        city = city.replace(/\s+/g, '-');
        //
        ////check user input dai
        //if(city.trim() != ""){
        //    //call server
        //
        //}
        Session.set("searchResult",""); // clear former results first ?
        Router.go('/search/?city=' + city + '&service=' + service );
        Meteor.call("getSearch", city, service, function(err, res){
            if(err){
                console.log(err);
            }
            else{
                console.log(res);
                Session.set("searchResult",res);
            }
        });
    },
    "click .btnStoreDetail":function(event){
        Router.go('/storeDetail/' + this._id);
    }
})
