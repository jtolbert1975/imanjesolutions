/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'imanjesolutions',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      },


    },//EmberENV

    firebase: {
      apiKey: "AIzaSyBV5xwkS-4i9Lsv5nxLsuZJr3RFSojXa6Q",
      authDomain: "imanje-cefa4.firebaseapp.com",
      contentSecurityPolicy: { 'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com" },
      databaseURL: "https://imanje-cefa4.firebaseio.com",
      storageBucket: "imanje-cefa4.appspot.com",
      messagingSenderId: "138960442912"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },



    contentSecurityPolicy: {
      'default-src' : "'none'",
      'connect-src': "'self' https://auth.firebase.com ws://localhost:49154/livereload wss://*.firebaseio.com ",
      'child-src': "'self' https://*.firebaseio.com",
      'script-src': "'self' 'unsafe-eval' ws://localhost:49154/livereload https://www.gstatic.com/ https://*.firebaseio.com"
    },
  /*  contentSecurityPolicy: {
      'default-src': "'http'",
      'script-src': "'self' 'unsafe-inline' https://www.gstatic.com/ https://!*.firebaseio.com https://www.googleapis.com",
    'font-src':    "'self''unsafe-inline'",
     'connect-src': "'self'",
      'img-src':     "'self' 'unsafe-inline'",
      'style-src':   "'self' 'unsafe-inline'",
      'media-src':   "'self'"

    },*/

/*    contentSecurityPolicy: {
      'default-src': "'none'",
      'font-src': "'self'",
      'script-src': " 'self' 'unsafe-eval' https://cdn.firebase.com https://!*.firebaseio.com https://!*.firebaseio.com",
      'frame-src': "'self' https://!*.firebaseapp.com",
      'connect-src': "'self' *",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline",
      'media-src': "'self'",
      'object-src': "'self'"
    },*/

  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.contentSecurityPolicy['connect-src'] = '*';
    ENV.contentSecurityPolicy['script-src'] = '\'self\' \'unsafe-eval\' \'unsafe-inline\' *';
    //ENV.APP.LOG_ACTIVE_GENERATION = true;
    //ENV.APP.LOG_TRANSITIONS = true;
     //ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    //ENV.APP.LOG_ACTIVE_GENERATION = false;
   //ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
