Accounts.onCreateUser(function (options, user){ //called bedore Accounts.validateNewUser
    user.profile = options.profile ? options.profile : {};

    if(user.services.facebook){
        try{
            var email = user.services.facebook.email;
            //user.emails = [{ address: email, verified: false }]
        }catch(e){
            throw new Meteor.Error(403,"Carvicer couldn't access your email address from Facebook");
        }
    }else{
        var email = user.emails[0].address;
    }



        //user.emails = email;
        //user.profile.firstName = user.services.facebook.first_name;
        //user.profile.lastName = user.services.facebook.last_name;
        //if (Meteor.users.findOne({emails: email}))
        //    throw new Meteor.Error(403, "A user with email " + user.emails[0].address + " already exists");


    //check if the email is unique


    try{
        var createStripeUser  = Meteor.wrapAsync(stripe.customers.create,stripe.customers);
        var result = createStripeUser({ email: email });
        user.services.stripeId = result.id;
        return user;
    }catch(e){
        throw new Meteor.Error(403, "Stripe Error: " + e.message);
    }
});