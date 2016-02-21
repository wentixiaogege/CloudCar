/**
 * Created by zhengxinyun on 10/14/15.
 */
Meteor.publish('getStoreDetail',function(storeId){
    return stores.find(storeId);
});

Meteor.publish('consts',function(){
    return consts.find();
});

Meteor.publish("getTrans", function(){
    return transactions.find({userId: this.userId});
});

Meteor.publish("getAvatar", function(){
   return [Images.find(),Meteor.users.find({_id: this.userId}, {fields: {'avatar': 1}})];;
});

Meteor.publish("checkActiveReq", function(){
    var output = orders.find({userId:this.userId});
    //check if the order has expired or not
    if (output.count() != 0){
        var thisOrder;
        output.forEach(function(cursor){
            thisOrder = cursor;
        });
        var createdAt = thisOrder.createdAt;
        createdAt = moment(createdAt, "YYYY-MM-DD HH:mm:ss ZZ");
        var expiredAt = thisOrder.expiredAt;
        expiredAt = moment(expiredAt, "YYYY-MM-DD HH:mm:ss ZZ");
        var timeLeft = expiredAt.diff(moment(), "minutes");
        if (timeLeft < 0){
            orders.remove(thisOrder._id);
            output = [];
            return output;
        }
    }
    return output;
});

Meteor.publish("getRequests", function(storeId){
    var store = stores.findOne(storeId);
    var output = orders.find(
        {
            loc:{
                $near:{
                    $geometry: {
                        type: "Point",
                        coordinates: store.loc.coordinates
                    },
                    $maxDistance: 2000000
                }
            },
            offeredStores:{
                $not:{
                    $elemMatch: {
                        $in:[storeId]
                    }
                }
            }
        });

    output.forEach(function(thisOrder){
        var expiredAt = thisOrder.expiredAt;
        expiredAt = moment(expiredAt, "YYYY-MM-DD HH:mm:ss ZZ");
        var timeLeft = expiredAt.diff(moment(), "minutes");
        if (timeLeft < 0){
            orders.remove(thisOrder._id);
        }
    });
    return output;
});

Meteor.publish("getOffers", function(storeId){
    var output = offers.find({storeId: storeId});
    return output;
});

Meteor.publish("getStoreTrans", function(storeId){
    return transactions.find({storeId: storeId});
});