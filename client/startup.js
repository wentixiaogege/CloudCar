Meteor.call("isProd",function(err,isProd){
    if(isProd)
        Stripe.setPublishableKey(Meteor.settings.public.stripeProdPublicKey);
    else
        Stripe.setPublishableKey(Meteor.settings.public.stripeTestPublicKey);
});