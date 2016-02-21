Meteor.startup(function() {
    // Add Facebook configuration entry
    ServiceConfiguration.configurations.update(
        {"service": "facebook"},
        {
            $set: {
                "appId": Meteor.settings.FbAppId,
                "secret": Meteor.settings.FbSecretKey
            }
        },
        {upsert: true}
    );
});