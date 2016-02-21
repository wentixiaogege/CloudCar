stores = new  Mongo.Collection("Stores");


stores.attachSchema(new SimpleSchema ({
    storeName: {
        type: String,
        //label:"Store Name",
        max:200
    },
    phoneNumber:{
        type: String,
        //label:"Phone"
    },
    licenceNo:{
        type: String,
        //label:"Licence No."
    },
    streetAddress:{
        type: String,
        //label:"Address"
    },
    city:{
        type: String,
        //label:"City"
    },
    sCity:{
        type: String,
    },
    state:{
        type: String,
        //label:"State"
    },
    ownerId:{
        type: String,
    },
    loc:{
        type: Object,
        blackbox:true,
    },
    //"loc.type":{
    //    type: String,
    //},
    //"loc.coordinates":{
    //    type:[Number],
    //},
    authenticated:{
        type: Boolean,
    },
    assistantsId: {
        type: [String],
        optional: true,
        optional: true
    },
    staffList:{
      type:[Object],
      optional: true,
      blackbox:true
    },
    scores: {
        type: String,
        optional: true
    },
    ratings: {
        type: String,
        optional: true
    },
    services: {
        type:[Object],
        optional: true,
        blackbox:true
    },
    stripeId:{
         type: String,
        optional:true,
    }  ,
    languages:{
        type: [String],
        optional:true,
    }  ,
    //userName: {
    //    type: String,
    //    autoValue: function(){
    //        if(this.isInsert){
    //            var reqUser = Meteor.users.findOne(this.field("userId").value);
    //            return reqUser.profile.firstName +' '+reqUser.profile.lastName;
    //        }else
    //            this.unset();
    //    }
    //},
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
}));