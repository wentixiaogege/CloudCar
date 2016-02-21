offers = new Mongo.Collection("Offers");

offers.attachSchema(new SimpleSchema ({
    orderId: {
        type: String
    },
    userId: {
        type: String
    },
    userName: {
        type: String,
        autoValue: function(){
            if(this.isInsert){
                var reqUser = Meteor.users.findOne(this.field("userId").value);
                return reqUser.profile.firstName +' '+reqUser.profile.lastName;
            }else
                this.unset();
        }
    },  storeId: {
        type: String
    },
    storeName: {
        type: String,
    },
    //storeStripeId:{
    //    type: String
    //},
    storeLoc:{
        type:Object,
        blackbox:true
    },
    //storeYelpId:{
    //    type:String
    //},
    price: {
        type: Number,
        decimal: true,
        min:1,
        max:500
    },
    service: {
        type: [String],
    },
    vehicle: {
        type: String
    },
    serviceDate: {
        type: String
    },
    customerMessage: {
        type: String,
        optional: true
    },
    message: {
        type: String,
        optional: true
    },
    valid: {  // invalid when customer changes order detail
        type: Boolean,
        defaultValue: true
    },
    accepted: {
        type: Boolean,
        defaultValue: false
    },
    canConfirm: {
        type: Boolean,
        defaultValue: false
    },
    receiptCode: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }else {
                this.unset();
            }
        },
        optional:true
    }
}));