orders = new Mongo.Collection("Orders");

orders.attachSchema(new SimpleSchema ({
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
    },
    loc: {
        type: Object,
        blackbox: true
    },
    // "loc.$.type":{
    //   type: String,
    //   defaultValue: "Point"
    // },
    // "loc.$.coordinates":{
    //   type: [Number],
    //   decimal: true
    // },
    service: {
        type: [String]
    },
    vehicle: {
        type: String
    },
    message: {
        type: String,
        optional: true
    },
    alloc: {  //Allocated (for web client)
        type: Boolean,
        defaultValue: false
    },
    offeredStores: {
      type: [String],
        optional: true
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {$setOnINsert: new Date};
            } else {
                this.unset();
            }
        },
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        optional: true
    },
    expiredAt: {
        type: String
    },
    date: {
        type: String
    }
}));