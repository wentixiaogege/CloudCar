Schema = {};

Schema.UserProfile = new SimpleSchema({
    firstName: {
        label:'First Name',
        type: String,
        regEx: /^[a-zA-Z-]{2,25}$/,
        min: 1,
        optional: true
    },
    lastName: {
        type: String,
        regEx: /^[a-zA-Z]{2,25}$/,
        min: 1,
        optional: true
    },
    avatar: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Images',
                label: ' '
            }
        },
        optional: true
    },
    phone: {
        type: String,
        min: 10,
        optional:true
    },
    vehicles:{
        type: [Object],
        optional: true
    },
    "vehicles.$.id":{
        type: String
    },
    "vehicles.$.make":{
        type: String
    },
    "vehicles.$.model":{
        type: String
    },
    "vehicles.$.year":{
        type: Number
    },
    myStores: {
        type: [Object],
        defaultValue: []
    },
    "myStores.$.id": {
        type: String
    },
    "myStores.$.storeName": {
        type: String
    }
});

Schema.UserServices = new SimpleSchema({
    password:{
        type: Object,
        blackbox: true,
        optional: true
    },
    resume:{
        type: Object,
        optional: true, //must be true
        blackbox: true
    },
    stripeId:{
        type: String
    },
    reward:{
        type: Number,
        defaultValue: 0
    }

});

Schema.User = new SimpleSchema({
    emails: {
        type: [Object]
        // this must be optional if you also use other login services like facebook,
        // but if you use only accounts-password, then it can be required

    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    services: {
        type: Schema.UserServices,
        optional: true
    }
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    // roles: {
    //     type: Object,
    //     optional: true,
    //     blackbox: true
    // },
    // // Option 2: [String] type
    // // If you are sure you will never need to use role groups, then
    // // you can specify [String] as the type
    // roles: {
    //     type: [String],
    //     optional: true
    // }
});

Meteor.users.attachSchema(Schema.User);