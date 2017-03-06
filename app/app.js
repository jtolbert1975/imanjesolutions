import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';



let App;


Ember.MODEL_FACTORY_INJECTIONS = true;



App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
  // Retrieve Firebase Messaging object.
 // const messaging = firebase.messaging();


  //messaging: firebase.messaging()
});

/*messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });*/



loadInitializers(App, config.modulePrefix);

export default App;
