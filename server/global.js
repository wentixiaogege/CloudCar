if(process.env.CARVICER_WEB_ENV=="production")
    stripe = Meteor.npmRequire('stripe')(Meteor.settings.stripeProdSecretKey);
else
    stripe = Meteor.npmRequire('stripe')(Meteor.settings.stripeTestSecretKey);