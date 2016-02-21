  Template.i18n_custom_dropdown.events({
    'click a': function (event) {
      event.preventDefault();

      var requestedLanguage = event.target.getAttribute('data-language');
      if(requestedLanguage) {
        console.log("setting language as: " + requestedLanguage);
        TAPi18n.setLanguage(requestedLanguage);
      }
    }
  });