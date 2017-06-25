"use strict";



define('imanjesolutions/adapters/admin', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
    //import ApplicationAdapter from './application';

    exports['default'] = _emberfireAdaptersFirebase['default'].extend({});

    /*export default DS.JSONAPIAdapter.extend({
        namespace: 'api/',
        host: 'http://localhost:8888',
        defaultSerializer: '-default'
    });*/
});
//import DS from 'ember-data';
define('imanjesolutions/adapters/application', ['exports', 'ember', 'emberfire/adapters/firebase'], function (exports, _ember, _emberfireAdaptersFirebase) {
    var inject = _ember['default'].inject;
    exports['default'] = _emberfireAdaptersFirebase['default'].extend({
        firebase: inject.service()
    });
});
define('imanjesolutions/adapters/contact', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].JSONAPIAdapter.extend({});
});
define('imanjesolutions/app', ['exports', 'ember', 'imanjesolutions/resolver', 'ember-load-initializers', 'imanjesolutions/config/environment'], function (exports, _ember, _imanjesolutionsResolver, _emberLoadInitializers, _imanjesolutionsConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _imanjesolutionsConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _imanjesolutionsConfigEnvironment['default'].podModulePrefix,
    Resolver: _imanjesolutionsResolver['default']
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

  (0, _emberLoadInitializers['default'])(App, _imanjesolutionsConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('imanjesolutions/components/about-content', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/components/admin-content', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        isContact: '',
        isQuote: '',

        init: function init() {
            this._super.apply(this, arguments);
            this.set('isContact', true);
            this.set('isQuote', false);
        },

        actions: {
            showTab: function showTab(tabName) {

                var tabname = tabName;

                //Check to see if selected tab equals the current tab
                if (tabname === 'quotes') {
                    var isCurrent = this.get('isQuote');
                    if (isCurrent === true) {
                        return false;
                    } else {
                        this.toggleProperty('isContact');
                        this.toggleProperty('isQuote');
                    }
                } else {
                    //Checks to make sure the current Tab is not Contacts
                    var isCurrent = this.get('isContact');
                    if (isCurrent === true) {
                        return false;
                    } else {
                        this.toggleProperty('isContact');
                        this.toggleProperty('isQuote');
                    }
                }
            }
        }

    });
});
define('imanjesolutions/components/admin-nav', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        actions: {
            showTab: function showTab(tabName) {

                var tname = tabName;
                this.sendAction('myAction', tname);
                return true;
            }
        }
    });
});
define('imanjesolutions/components/contact-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        model: function model() {
            return {
                contact: [{ name: '' }, { email: '' }, { phone: '' }, { contactMethd: '' }]

            };
        },

        selectedContctMethd: '',

        actions: {
            submitForm: function submitForm() {
                console.log("The form has been submitted");
                //this.set('isEnabled', false);
                //this.send('toggleModal');
                // this.get('onSubmit')();
                this.toggleProperty('isShown');
                this.toggleProperty('isSubmitted');
            },

            toggleModal: function toggleModal() {
                console.log("You reached the toggle");
                //this.set('isEnabled', false);
                this.toggleProperty('isEnabled');
            }
        }

    });
});
define('imanjesolutions/components/contact-list', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        store: _ember['default'].inject.service(),
        selectedQuote: '',

        init: function init() {
            this._super();
            this.initialize();
        },

        initialize: function initialize() {
            var _this = this;

            //sets the promise
            this.contactList().then(function (data) {
                //the callback
                _this.set('contactEntries', data);
            });
        },

        contactList: function contactList() {
            var store = this.get('store');

            return store.findAll('contacts');
        },

        actions: {
            getID: function getID() {
                var id = _ember['default'].$('input[name=optradio]:checked').val();
                //this.get('selectedQuote');
                console.log("The Id is: ", id);
                this.send('getContact', id);
            },

            getContact: function getContact(id) {
                var _this2 = this;

                var contactId = id;
                console.log("Get Contact: ", contactId);
                // const store = this.get('store');
                //let contact = store.findRecord('contacts' ,contactId);

                this.contactFound(contactId).then(function (data) {
                    var contactData = data;

                    console.log("The contact is: ", contactData);
                    _this2.send('saveQuote', contactData);

                    //this.set('contactData', data);
                });
            },

            saveQuote: function saveQuote(contactData) {
                console.log("YOu called saveQuote:", contactData);

                var record = contactData.data;
                var f_name = record.f_name;
                var l_name = record.l_name;
                var name = f_name + " " + l_name;
                var email = record.email;
                var contactMethod = record.contactMethd;
                var phone = record.phone;
                var description = record.request;
                var skype = record.skype;

                _ember['default'].LOGGER.Logger("Contact Method: " + contactMethod);
                _ember['default'].LOGGER.Logger("Contact Method: " + skype);

                var store = this.get('store');
                var newQuote = store.createRecord('quotes', {
                    name: name,
                    email: email,
                    phone: phone,
                    about: '',
                    budget: '',
                    web_address: '',
                    pages: '',
                    description: description,
                    features: '',
                    example1: '',
                    example2: '',
                    example3: ''

                });

                newQuote.save();
                //this.get('router').transitionTo('thankyou');
                console.log("You called save");
                //return true;
            }

        },

        contactFound: function contactFound(contactId) {
            console.log("You called Contact Found");

            var store = this.get('store');
            return store.findRecord('contacts', contactId);
        }

    });
});
define('imanjesolutions/components/contact-us', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        store: _ember['default'].inject.service(),
        isShown: '',
        isSubmitted: 'false',
        notSubmit: '',
        isValidName: '',
        nameErr: (function () {
            var name = this.get('name');
            if (_ember['default'].isEmpty(name) || _ember['default'].isBlank(name)) {
                this.set('isValidName', false);
                return "required";
            }

            if (name.length < 5) {
                this.set('isValidName', false);
                return "minimum is 5 characters";
            }

            this.set('Name', true);
        }).property('name'),

        disabled: function disabled() {
            var isValidName = this.get('isValidName');

            if (isValidName) {
                return false;
            } else {
                return true;
            }
        },

        init: function init() {
            this._super.apply(this, arguments);
            this.set('isShown', false);
            this.set('isSubmitted', false);
            this.set('notSubmit', true);
            this.set('isValidName', true);
        },

        didInsertElement: function didInsertElement() {},

        actions: {

            showForm: function showForm() {

                this.toggleProperty('isShown');
            },

            createContact: function createContact() {
                console.log("You are Now creating a contact");
                //let contactMethd = this.get('selectedContctMethd');
                // console.log("Contact Method: " + contactMethd);
                var store = this.get('store');
                var newContact = store.createRecord('contacts', {
                    f_name: this.get('fname'),
                    l_name: this.get('lname'),
                    email: this.get('email'),
                    phone: this.get('phone'),
                    skype: this.get('skype'),
                    contactMethd: this.get('selectedContctMethd'),
                    request: this.get('request')

                });

                newContact.save();
                //this.get('router').transitionTo('thankyou');
                var tabName = "quotes";
                this.sendAction('showTab', tabName);
                this.toggleProperty('isShown');
                this.toggleProperty('isSubmitted');
                this.set('fname', '');
                this.set('lname', '');
                this.set('email', '');
                this.set('phone', '');
                this.set('skype', '');
                this.set('selectedContctMethd', '');
                this.set('request', '');

                //return true;
            },

            showTab: function showTab(tabName) {
                console.log("You called Show Tab");

                //let tname = tabName;
                this.sendAction('myAction', tabName);
                return true;
            }

        }
    });
});
define('imanjesolutions/components/content-container', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/components/ember-modal-dialog-positioned-container', ['exports', 'ember-modal-dialog/components/positioned-container'], function (exports, _emberModalDialogComponentsPositionedContainer) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsPositionedContainer['default'];
    }
  });
});
define('imanjesolutions/components/ember-wormhole', ['exports', 'ember-wormhole/components/ember-wormhole'], function (exports, _emberWormholeComponentsEmberWormhole) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberWormholeComponentsEmberWormhole['default'];
    }
  });
});
define('imanjesolutions/components/folio-content', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        mCard: true,
        dCard1: false,
        dCard2: false,
        dcard3: '',
        dcard4: '',
        dCard5: '',
        dcard6: '',
        dcard7: '',
        dCard8: '',
        dCard9: '',

        actions: {
            showDesktop: function showDesktop(card) {

                this.toggleProperty('mCard');

                var selectedCard = card;
                console.log("Desktop View of: " + selectedCard);

                this.send('displayDesk', selectedCard);
            },

            displayDesk: function displayDesk(selectedCard) {
                var dcard = selectedCard;

                console.log("Now displaying Desktop Card: " + dcard);

                this.toggleProperty(dcard);
            },

            closeDesktop: function closeDesktop(dcard) {
                this.toggleProperty(dcard);
                this.toggleProperty('mCard');
            }
        }

    });
});
define('imanjesolutions/components/footer-comp', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        classNames: ['toTop'],
        routing: _ember['default'].inject.service('-routing'),
        isIndex: '',

        init: function init() {
            this._super.apply(this, arguments);
        },

        didRender: function didRender() {
            this._super.apply(this, arguments);
            var daRoute = this.get('routing.currentRouteName');

            console.log("This is the Route: ", daRoute);

            if (daRoute === 'index') {
                this.set('isIndex', true);
            } else {
                // console.log("Hello You are Not Index");
                this.set('isIndex', false);
            }
        },

        click: function click() {

            window.scrollTo(0, 120);
            //alert('Hello World');
        }

    });
});
define('imanjesolutions/components/header-content', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/components/hme-content', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        routing: _ember['default'].inject.service('-routing'),
        isWebdesign: '',
        showWebdesign: '',
        isWebApp: '',
        showWebApp: '',
        isSocial: '',
        showSocial: '',
        isBranding: '',
        showBranding: '',

        didInsertElement: function didInsertElement() {
            this.set('isWebdesign', true);
            this.set('showWebdesign', false);

            this.set('isWebApp', true);
            this.set('showWebApp', false);

            this.set('isSocial', true);
            this.set('showSocial', false);

            this.set('isBranding', true);
            this.set('showBranding', false);
        },

        actions: {
            toggleSquare: function toggleSquare() {
                this.toggleProperty('isWebdesign');
                this.toggleProperty('showWebdesign');
            },

            toggleApp: function toggleApp() {
                this.toggleProperty('isWebApp');
                this.toggleProperty('showWebApp');
            },

            toggleSocial: function toggleSocial() {
                this.toggleProperty('isSocial');
                this.toggleProperty('showSocial');
            },

            toggleBrand: function toggleBrand() {
                this.toggleProperty('isBranding');
                this.toggleProperty('showBranding');
            }
        }
    });
});
define('imanjesolutions/components/landing-content', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/components/legit-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        isEnabled: false,
        model: _ember['default'].Object.create({
            name: ''
        }),
        //rules hash for validation
        rules: {
            name: 'required'
        },

        actions: {
            validityChanged: function validityChanged(validState) {

                if (validState) {
                    _ember['default'].log(validState);
                    this.set('isEnabled', true);
                } else {
                    this.set('isEnabled', false);
                }
            }
        }

    });
});
define('imanjesolutions/components/legit-quote', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        isEnabled: false,
        model: _ember['default'].Object.create({
            name: ''
        }),
        //rules hash for validation
        rules: {
            name: 'required'
        },

        actions: {
            validityChanged: function validityChanged(validState) {

                if (validState) {
                    _ember['default'].log(validState);
                    this.set('isEnabled', true);
                } else {
                    this.set('isEnabled', false);
                }
            }
        }
    });
});
define('imanjesolutions/components/modal-dialog-overlay', ['exports', 'ember-modal-dialog/components/modal-dialog-overlay'], function (exports, _emberModalDialogComponentsModalDialogOverlay) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsModalDialogOverlay['default'];
    }
  });
});
define('imanjesolutions/components/modal-dialog', ['exports', 'ember-modal-dialog/components/modal-dialog'], function (exports, _emberModalDialogComponentsModalDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsModalDialog['default'];
    }
  });
});
define('imanjesolutions/components/my-modal', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        actions: {
            ok: function ok() {
                this.$('.modal').modal('hide');
                this.sendAction('ok');
            },

            show: (function () {
                this.$('.modal').modal();
            }).on('didInsertElement')
        }

    });
});
define('imanjesolutions/components/nav-bar', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/components/quote-form', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        store: _ember['default'].inject.service(),
        isQuote: '',
        notSubmit: '',
        isSubmitted: '',
        isValidName: '',
        selectedBudget: '',
        nameErr: (function () {
            var name = this.get('name');
            if (_ember['default'].isEmpty(name) || _ember['default'].isBlank(name)) {
                this.set('isValidName', false);
                return "required";
            }

            if (name.length < 5) {
                this.set('isValidName', false);
                return "minimum is 5 characters";
            }

            this.set('Name', true);
        }).property('name'),

        disabled: function disabled() {
            var isValidName = this.get('isValidName');

            if (isValidName) {
                return false;
            } else {
                return true;
            }
        },
        init: function init() {
            this._super.apply(this, arguments);
            this.set('isQuote', false);
            this.set('isSubmitted', false);
            this.set('notSubmit', true);
            this.set('isValidName', true);
        },

        actions: {

            showQuoteFm: function showQuoteFm() {
                console.log("Show the Quote Form");

                this.toggleProperty('isQuote');
            },

            /* createQuote: function(){
                 console.log("You are Now creating a Quote");
              },*/

            submitQuote: function submitQuote() {
                //  console.log("YOu submitted a quote");
                // this.toggleProperty('isQuote');
                // this.toggleProperty('isSubmitted');
                // this.toggleProperty('notSubmit');
            },

            createQuote: function createQuote() {
                this.toggleProperty('isQuote');
                this.toggleProperty('isSubmitted');
                console.log("You are Now creating a quote");
                // let contactMethd = this.get('selectedContctMethd');
                //console.log("Contact Method: " + contactMethd);
                var store = this.get('store');
                var newQuote = store.createRecord('quotes', {
                    name: this.get('name'),
                    email: this.get('email'),
                    phone: this.get('phone'),
                    about: this.get('about'),
                    budget: this.get('selectedBudget'),
                    web_address: this.get('web_address'),
                    pages: this.get('selectedPages'),
                    description: this.get('description'),
                    features: this.get('features'),
                    example1: this.get('example1'),
                    example2: this.get('example2'),
                    example3: this.get('example3')

                });

                newQuote.save();
                this.get('router').transitionTo('thankyou');
                this.set('name', '');
                this.set('email', '');
                this.set('phone', '');
                this.set('about', '');
                this.set('selectedBudget', '');
                this.set('web_address', '');
                this.set('selectedPages', '');
                this.set('description', '');
                this.set('features', '');
                this.set('example1', '');
                this.set('example2', '');
                this.set('example3', '');

                //return true;
            },

            toggleModal: function toggleModal() {
                console.log("You reached the toggle");
                //this.set('isEnabled', false);
                this.toggleProperty('isEnabled');
            }

        }
    });
});
define('imanjesolutions/components/quotes-list', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        store: _ember['default'].inject.service(),
        record: _ember['default'].inject.service('record'),
        isShowingModal: '',
        name: '',

        init: function init() {
            this._super();
            this.initialize();
            this.set('isShowingModal', false);

            //this.modalData();
        },
        initialize: function initialize() {
            var _this = this;

            this.quoteList().then(function (data) {

                _this.set('quotes', data);
            });
        },

        quoteList: function quoteList() {
            var store = this.get('store');

            return store.findAll('quotes');
        },

        actions: {
            showModal: function showModal(id) {
                var _this2 = this;

                console.log("You called Show Modal");

                ///var  recd =  this.get('record').modalData(id);
                this.findQuote(id).then(function (data) {
                    _this2.set('quote', data);
                });
                // this.set('name', recd.name);

                //console.log("The quote is: ", recd);
                //this.set('quote', recd);
                this.toggleProperty('isShowingModal');
                //this.$().modal('show');
            }

        },

        /*   removeModal: function() {
               this.disconnectOutlet({
                   outlet: 'modal',
                   parentView: 'quotes-list'
               });
           },*/

        modalData: function modalData(id, store) {
            console.log("You reached modal Data");

            // const store = this.get('store');

            var quote = store.findRecord('quotes', id);

            console.log("You are found the quote", quote);

            return quote;

            // this.getQuote(id).then((data) => {

            //this.set('quote', data);
            //});
        },

        findQuote: function findQuote(id) {
            console.log("You are getting the quote", id);
            // const store = this.get('store');
            var foundQuote = this.get('record').modalData(id);
            console.log("GetQuote Returned: ", foundQuote);

            return foundQuote;
        }

    });
});
define("imanjesolutions/components/quotes-modal", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Component.extend({
        actions: {
            save: function save() {
                alert("You wan Save a Quote Bol???");
                // save to server
            }
        }
    });
});
define('imanjesolutions/components/radio-button', ['exports', 'ember-radio-buttons/components/radio-button'], function (exports, _emberRadioButtonsComponentsRadioButton) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberRadioButtonsComponentsRadioButton['default'];
    }
  });
});
define('imanjesolutions/components/services-content', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({
        isActive: 'false',
        isApps: 'false',
        isNet: 'false',
        isBrand: 'false',

        init: function init() {
            this._super.apply(this, arguments);
            this.set('isActive', false);
            this.set('isApps', false);
            this.set('isNet', false);
            this.set('isBrand', false);
        },

        actions: {

            titleClick: function titleClick() {

                this.toggleProperty('isActive');
            },

            appsClick: function appsClick() {
                this.toggleProperty('isApps');
            },

            netClick: function netClick() {
                this.toggleProperty('isNet');
            },
            brandClick: function brandClick() {
                this.toggleProperty('isBrand');
            }

        }

    });
});
define('imanjesolutions/components/simple-modal', ['exports', 'ember', 'imanjesolutions/templates/components/simple-modal'], function (exports, _ember, _imanjesolutionsTemplatesComponentsSimpleModal) {
    exports['default'] = _ember['default'].Component.extend({
        isEnabled: false,
        expose: (function () {
            var app_controller = this.get('targetObject');
            var exposedName = "comp-" + this.get('id');
            app_controller.set(exposedName, this);
        }).on('init'),
        actions: {
            toggleModal: function toggleModal() {
                this.toggleProperty('isEnabled');
                this.toggleProperty('isShown');
            }
        },
        layout: _imanjesolutionsTemplatesComponentsSimpleModal['default']
    });
});
define('imanjesolutions/components/submit-button', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Component.extend({

        actions: {
            submitForm: function submitForm() {
                console.log("You Called submit Form");
                //this.send('createContact', this);
                this.get('onSubmit')();

                //return true;
            }
        }

    });
});
define('imanjesolutions/components/tether-dialog', ['exports', 'ember-modal-dialog/components/tether-dialog'], function (exports, _emberModalDialogComponentsTetherDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogComponentsTetherDialog['default'];
    }
  });
});
define('imanjesolutions/components/thank-you', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('imanjesolutions/controllers/admin', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('imanjesolutions/controllers/contact', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        actions: {
            //createContact: function(){
            //    console.log("You are Now creating a contact");
            //    var newContact = this.store.createRecord('contact', {
            //        f_name: this.get('fname'),
            //        l_name: this.get('lname'),
            //        email: this.get('email'),
            //        phone: this.get('phone'),
            //        skype: this.get('skype'),
            //        contactMethd: this.get('selectedContctMethd'),
            //        request: this.get('request'),
            //
            //    });
            //
            //    newContact.save();
            //    this.transitionTo('thankyou');
            //}
        }
    });
});
define('imanjesolutions/controllers/contacts/inquiries', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Controller.extend({
        actions: {
            deleteContact: function deleteContact(contact) {
                contact.deleteRecord();
                contact.save();
            }
        }
    });
});
define('imanjesolutions/controllers/quote', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({});
});
define('imanjesolutions/helpers/app-version', ['exports', 'ember', 'imanjesolutions/config/environment'], function (exports, _ember, _imanjesolutionsConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _imanjesolutionsConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('imanjesolutions/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('imanjesolutions/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('imanjesolutions/initializers/add-modals-container', ['exports', 'ember-modal-dialog/initializers/add-modals-container'], function (exports, _emberModalDialogInitializersAddModalsContainer) {
  exports['default'] = {
    name: 'add-modals-container',
    initialize: _emberModalDialogInitializersAddModalsContainer['default']
  };
});
define('imanjesolutions/initializers/allow-link-action', ['exports', 'ember-link-action/initializers/allow-link-action'], function (exports, _emberLinkActionInitializersAllowLinkAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLinkActionInitializersAllowLinkAction['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLinkActionInitializersAllowLinkAction.initialize;
    }
  });
});
define('imanjesolutions/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'imanjesolutions/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _imanjesolutionsConfigEnvironment) {
  var _config$APP = _imanjesolutionsConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('imanjesolutions/initializers/component-router-injector', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    // application.inject('route', 'foo', 'service:foo');
    //application.inject('component', 'router', 'router:Main');
    application.inject('component', 'store', 'service:store');
  }

  exports['default'] = {
    //name: 'component-router-injector',
    name: 'inject-store-into-components',
    initialize: initialize
  };
});
define('imanjesolutions/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('imanjesolutions/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('imanjesolutions/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('imanjesolutions/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('imanjesolutions/initializers/export-application-global', ['exports', 'ember', 'imanjesolutions/config/environment'], function (exports, _ember, _imanjesolutionsConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_imanjesolutionsConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _imanjesolutionsConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_imanjesolutionsConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('imanjesolutions/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('imanjesolutions/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('imanjesolutions/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("imanjesolutions/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('imanjesolutions/mixins/link-action', ['exports', 'ember-link-action/mixins/link-action'], function (exports, _emberLinkActionMixinsLinkAction) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLinkActionMixinsLinkAction['default'];
    }
  });
});
define('imanjesolutions/models/contacts', ['exports', 'ember-data'], function (exports, _emberData) {

    var contacts = _emberData['default'].Model.extend({
        f_name: _emberData['default'].attr('string'),
        l_name: _emberData['default'].attr('string'),
        email: _emberData['default'].attr('string'),
        phone: _emberData['default'].attr('string'),
        skype: _emberData['default'].attr('string'),
        contactMethd: _emberData['default'].attr('string'),
        request: _emberData['default'].attr('string')
    });

    /*Contacts.reopenClass({
        FIXTURES: [
            {
                id: 0,
                name: 'Jesse James',
                email: 'jjtheman@gmail.com',
                phone: '6102787893',
                contactMethd: 'email',
                request: 'I want to know, how long it will take to build an e-commerce site'
            },
    
            {
                id: 1,
                name: 'Ashley Nixon',
                email: 'ashleylips@gmail.com',
                phone: '4047862235',
                contactMethd: 'email',
                request: 'I want to know, how long it will take to build an e-commerce site'
            },
    
            {
                id: 2,
                name: 'Tasha Pearlman',
                email: 'tgoodpuccie@gmail.com',
                phone: '4042078869',
                contactMethd: 'phone',
                request: 'I want to know, how long it will take to build a blog'
            }
        ]
    
    }) ;*/

    exports['default'] = contacts;
});
define('imanjesolutions/models/quotes', ['exports', 'ember-data'], function (exports, _emberData) {

    var Quotes = _emberData['default'].Model.extend({
        name: _emberData['default'].attr('string'),
        email: _emberData['default'].attr('string'),
        phone: _emberData['default'].attr('string'),
        about: _emberData['default'].attr('string'),
        budget: _emberData['default'].attr('string'),
        web_address: _emberData['default'].attr('string'),
        pages: _emberData['default'].attr('string'),
        description: _emberData['default'].attr('string'),
        features: _emberData['default'].attr('string'),
        example1: _emberData['default'].attr('string'),
        example2: _emberData['default'].attr('string'),
        example3: _emberData['default'].attr('string')

    });

    /*Quotes.reopenClass({
        FIXTURES: [
        {
            id: 0,
            name: 'Jesse James',
            email: 'jjtheman@gmail.com',
            phone: '6102787893'
    
        },
    
        {
            id: 1,
            name: 'Ashley Nixon',
            email: 'ashleylips@gmail.com',
            phone: '4047862235'
    
        },
    
        {
            id: 2,
            name: 'Tasha Pearlman',
            email: 'tgoodpuccie@gmail.com',
            phone: '4042078869'
    
        }
    ]
    });*/

    exports['default'] = Quotes;
});
define('imanjesolutions/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('imanjesolutions/router', ['exports', 'ember', 'imanjesolutions/config/environment'], function (exports, _ember, _imanjesolutionsConfigEnvironment) {

  var router = _ember['default'].Router.extend({
    location: _imanjesolutionsConfigEnvironment['default'].locationType,
    rootURL: _imanjesolutionsConfigEnvironment['default'].rootURL
  });

  router.map(function () {
    this.route('home');
    this.route('about');
    this.route('services');
    this.route('contact', function () {});
    this.route('login');
    this.route('admin');
    this.route('contacts', function () {
      this.route('inquiries');
    });
    this.route('thankyou');
    this.route('folio');
  });

  exports['default'] = router;
});
define('imanjesolutions/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/admin', ['exports', 'ember'], function (exports, _ember) {
   //import RSVP from 'rsvp';

   exports['default'] = _ember['default'].Route.extend({

      /*    model(){
           return this.store.findAll('contacts');
          }*/

      model: function model() {
         return _ember['default'].RSVP.hash({
            contact: this.store.findAll('contacts'),
            quote: this.get('store').findAll('Quotes')
         });
      }

   });
});
define('imanjesolutions/routes/contact', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        /*    renderTemplate: function(){
                this.render();
        
                this.render('contact/contact-us', {
                    into: 'contact',
                    outlet: 'contact-us',
                    controller: 'contact'
                });
        
                this.render('contact/quote-form', {
                    into: 'contact',
                    outlet: 'quote-form',
                    controller: 'quote'
                });
            },*/
        /*
            model(){
                return Ember.RSVP.hash({
                    contact: this.get('store').findAll('Contacts'),
                    quote: this.get('store').findAll('Quotes'),
        
              });
            },
        
            setupController(controller, model) {
                this._super(...arguments);
                Ember.set(controller, 'contact', model.contact);
                Ember.set(controller, 'quote', model.quote);
            }*/
    });
});
define('imanjesolutions/routes/contacts', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        // model(){
        // return Ember.RSVP.hash({
        // contact: this.get('store').findAll('contacts')
        //quote: this.get('store').findAll('Quotes'),

        // });
        // }
    });
});
define('imanjesolutions/routes/contacts/inquiries', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].Route.extend({
        /* model() {
             return this.store.find('contacts', {
                 orderBy: 'id',
             });
         }*/
    });
});
define('imanjesolutions/routes/folio', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/home', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/login', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/services', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/routes/thankyou', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('imanjesolutions/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('imanjesolutions/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('imanjesolutions/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define('imanjesolutions/services/modal-dialog', ['exports', 'ember', 'ember-modal-dialog/services/modal-dialog', 'imanjesolutions/config/environment'], function (exports, _ember, _emberModalDialogServicesModalDialog, _imanjesolutionsConfigEnvironment) {
  var computed = _ember['default'].computed;
  exports['default'] = _emberModalDialogServicesModalDialog['default'].extend({
    destinationElementId: computed(function () {
      /*
        everywhere except test, this property will be overwritten
        by the initializer that appends the modal container div
        to the DOM. because initializers don't run in unit/integration
        tests, this is a nice fallback.
      */
      if (_imanjesolutionsConfigEnvironment['default'].environment === 'test') {
        return 'ember-testing';
      }
    })
  });
});
define("imanjesolutions/services/record", ["exports", "ember"], function (exports, _ember) {
    exports["default"] = _ember["default"].Service.extend({

        store: _ember["default"].inject.service(),

        modalData: function modalData(id) {
            console.log("You reached modal Data");

            this.getQuote(id).then(function (data) {

                var quote = data.data;

                console.log("This should b the quote", quote);
                //this.set('quote', data);

                return quote;
            });
        },

        getQuote: function getQuote(id) {
            console.log("You are getting the quote", id);
            var store = this.get('store');

            // var fQuote = store.findRecord('quotes', id);

            //console.log('The Quote was found ', fQuote);

            return store.findRecord('quotes', id);
        }

    });
});
define("imanjesolutions/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Fv9wVmo/", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"about-content\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/about.hbs" } });
});
define("imanjesolutions/templates/admin", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PvYB+0Xf", "block": "{\"statements\":[[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"admin-content\"]],false],[\"text\",\"\\n\\n\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/admin.hbs" } });
});
define("imanjesolutions/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "xci2b/rc", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-full app-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"header-content\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"nav-bar\"]],false],[\"text\",\"\\n\"],[\"block\",[\"content-container\"],null,null,0],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"<div class=\\\"container-fluid\\\">\"],[\"text\",\"\\n\\n\"],[\"comment\",\"</div>\"],[\"text\",\"\\n\\n\"],[\"comment\",\"TODO: Change the partials to components\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/application.hbs" } });
});
define("imanjesolutions/templates/components/about-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "oaoVHC4G", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row about\"],[\"static-attr\",\"xmlns\",\"http://www.w3.org/1999/html\",\"http://www.w3.org/2000/xmlns/\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row top_margin\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\" d-flex flex-column about-title\"],[\"flush-element\"],[\"text\",\"Who Are We\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row about-intro-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-1 col-lg-6 about-text_container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"intro\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"b\",[]],[\"flush-element\"],[\"text\",\"Imanje Solutions\"],[\"close-element\"],[\"text\",\" is the vision of Web Developer, Jonathan  “JT” Tolbert.\\n            JT is a passionate web developer with 10 years of professional and enterprise experience.\\n            He has worked as both an employee and to an array of differnet organizations spanning across\\n            different industries. From century old Global Organizations to upcoming innovative Start-Ups,\\n            JT has lent his talents to help and lead development of various web and software solutions.\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"intro\"],[\"flush-element\"],[\"text\",\"\\n            Imanje Solutions is an extension of JT’s passion and driven commitment to provide\\n            innovative solutions that meet our clients needs.\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"intro\"],[\"flush-element\"],[\"text\",\"\\n            Our Mision is to continue to push the envelope of what is possible,\\n            and provide tomorrow’s solutions for today’s problems.\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"about-img_container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/jtHooverDam.jpg\"],[\"static-attr\",\"alt\",\"Jonathan Tolbert\"],[\"static-attr\",\"class\",\"img-circle img-size \"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"hr\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"embid-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"process-container\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title\"],[\"flush-element\"],[\"text\",\"The Process\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/joelEmbid.png\"],[\"static-attr\",\"alt\",\"The Process\"],[\"static-attr\",\"class\",\"process-img process\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n     \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap cell-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-7 step1\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title celltower-title\"],[\"flush-element\"],[\"text\",\"Step 1. \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-text\"],[\"flush-element\"],[\"text\",\"Contact Us - Submit a Quote\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"d-flex cell-img_container\"],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/cellTower.gif\"],[\"static-attr\",\"alt\",\"Contact Us\"],[\"static-attr\",\"class\",\"process-img celltower\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n          \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"class\"],[\"process-link\"]],0],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap process-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-6 first-contact_height process-step\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title alien-title\"],[\"flush-element\"],[\"text\",\"Step 2. \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-text2 \"],[\"flush-element\"],[\"text\",\"First Contact - Q&A to give clarification of our services and to gain understanding of your vision. Set up a Meet and Greet\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"d-flex alien-img_container\"],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/alien.png\"],[\"static-attr\",\"alt\",\"First Contact\"],[\"static-attr\",\"class\",\"process-img alien\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap process-row first-contact_height\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-6 process-step\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title meet-title\"],[\"flush-element\"],[\"text\",\"Step 3. \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-text2 meet-text\"],[\"flush-element\"],[\"text\",\"Meet & Greet - Presentation of possible solutions based off of First Contact discussion. Opportunity to further gather project requirements. \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"d-flex meet-img_container\"],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/meetandgreet.png\"],[\"static-attr\",\"alt\",\"Meet and Greet\"],[\"static-attr\",\"class\",\"process-img meet\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap process-row first-contact_height\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-1 col-md-6 process-step\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title agreement-title\"],[\"flush-element\"],[\"text\",\"Step 4. \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-text2 agreement-text\"],[\"flush-element\"],[\"text\",\"Work Agreement - Once a solution is agreed upon. We will establish a time line. Sign a statemtent of work and Contract. Deposit due at this time. \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"agreement-img_container\"],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/contract.png\"],[\"static-attr\",\"alt\",\"Work Agreement\"],[\"static-attr\",\"class\",\"process-img agreement\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap process-row first-contact_height\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-6 process-step thumbsup-group\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-title thumbsup-title\"],[\"flush-element\"],[\"text\",\"Step 5. \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"process-text2 thumbsup-text\"],[\"flush-element\"],[\"text\",\"Develop, Test, Deploy - Development begins per timeline. Each milestone is completed with your approval. After testing and your final approval, your project is deployed. Final payment due.\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"thumbsup-img_container\"],[\"flush-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/thumbsup.png\"],[\"static-attr\",\"alt\",\"Meet and Greet\"],[\"static-attr\",\"class\",\"process-img thumbsup\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row-nowrap bottom-row\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Click Here\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/about-content.hbs" } });
});
define("imanjesolutions/templates/components/admin-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "aw5bC80k", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"text-center intro--logo-top\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/aboutLogo.png\"],[\"static-attr\",\"alt\",\"Imanje Solutions\"],[\"static-attr\",\"class\",\"about-logo\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"admin-nav\"],null,[[\"myAction\"],[\"showTab\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row t-table\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isContact\"]]],null,1],[\"block\",[\"if\"],[[\"get\",[\"isQuote\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"        \"],[\"append\",[\"unknown\",[\"quotes-list\"]],false],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"\\n        \"],[\"append\",[\"unknown\",[\"contact-list\"]],false],[\"text\",\"\\n\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/admin-content.hbs" } });
});
define("imanjesolutions/templates/components/admin-nav", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "B/hvMf0/", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row inq__tab--row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-1\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-1 inq__tab--contact\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"class\",\"inq__tab inq__tab--title\"],[\"static-attr\",\"data-name\",\"contacts\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showTab\",\"contacts\"]],[\"flush-element\"],[\"text\",\"Contacts\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-3 inq__tab--quotes\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"class\",\"inq__tab inq__tab--title\"],[\"static-attr\",\"data-name\",\"quotes\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showTab\",\"quotes\"]],[\"flush-element\"],[\"text\",\"Quotes\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/admin-nav.hbs" } });
});
define("imanjesolutions/templates/components/contact-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "3MqSXlCq", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submitForm\"],[[\"onSubmit\"],[\"submitForm\"]]],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Contact Information\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"name\"],[\"flush-element\"],[\"text\",\"Your Name:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"required\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"contact\",\"name\"]],\"required\"]]],false],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"flush-element\"],[\"text\",\"Email Address:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"email\",\"form-control focusedInput\",[\"get\",[\"contact\",\"email\"]],\"required\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"phone\"],[\"flush-element\"],[\"text\",\"Phone Number:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"tel\",\"form-control focusedInput\",[\"get\",[\"contact\",\"phone\"]],\"required\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Preferred Contact Method:\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radio\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Email\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Phone\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Text\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Text\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Skype\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Skype\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Facetime\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Facetime\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"inquiry\"],[\"flush-element\"],[\"text\",\"Inquiry:\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"id\",\"value\"],[\"form-control\",\"5\",\"inquiry\",[\"get\",[\"contact\",\"request\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-info pull-right\"],[\"static-attr\",\"value\",\"Submit\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleModal\"]],[\"flush-element\"],[\"text\",\"Submit\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isSubmitted\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group has-success has-feedback col-lg-12 success-fix\"],[\"flush-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"id\",\"inputSuccess\"],[\"static-attr\",\"value\",\"Thank you! You will be contacted with in 1 business day\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/contact-form.hbs" } });
});
define("imanjesolutions/templates/components/contact-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "MjilmBxD", "block": "{\"statements\":[[\"yield\",\"default\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"theader\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Contacts\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"Column Headers\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"trow\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"comment\",\"ID\"],[\"text\",\"\\n    \"],[\"comment\",\"<div class=\\\"tcol-1\\\">\"],[\"text\",\"\\n        \"],[\"comment\",\"<span class=\\\"table-header\\\">ID</span>\"],[\"text\",\"\\n    \"],[\"comment\",\"</div>\"],[\"text\",\"\\n    \"],[\"comment\",\"Name\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Email\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Phone\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Skype\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Skype\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Method\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header tooltip\"],[\"flush-element\"],[\"text\",\"Contact\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"tooltiptext\"],[\"flush-element\"],[\"text\",\"Preferred Contact Method\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Request\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-3\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Inquiry\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Quote\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"Contacts List\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"contactEntries\"]]],null,0],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"trow\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"comment\",\"ID\"],[\"text\",\"\\n        \"],[\"comment\",\"<div class=\\\"tcol-1\\\">\"],[\"text\",\"\\n            \"],[\"comment\",\"<span class=\\\"table-cell\\\"></span>\"],[\"text\",\"\\n        \"],[\"comment\",\"</div>\"],[\"text\",\"\\n        \"],[\"comment\",\"Name\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"dynamic-attr\",\"data-id\",[\"unknown\",[\"contact\",\"id\"]],null],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"f_name\"]],false],[\"append\",[\"unknown\",[\"contact\",\"l_name\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Email\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Phone\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"phone\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Skype\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"skype\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Method\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"contactMethd\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Request\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-3\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"contact\",\"request\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1 make-quote\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radio\"],[\"static-attr\",\"id\",\"quote\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"getID\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\",\"action\"],[\"radio\",\"optradio\",[\"get\",[\"contact\",\"id\"]],[\"get\",[\"selectedQuote\"]],\"getID\"]]],false],[\"close-element\"],[\"text\",\"\\n\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[\"contact\"]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/contact-list.hbs" } });
});
define("imanjesolutions/templates/components/contact-us", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "opiyxWP+", "block": "{\"statements\":[[\"text\",\"\\n    \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showForm\"]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Contact Us\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"notSubmit\"]]],null,6],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isShown\"]]],null,5],[\"text\",\"\\n\\n\\n\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isSubmitted\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group has-success has-feedback col-lg-12 success-fix\"],[\"flush-element\"],[\"text\",\"\\n\\n              \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"id\",\"inputSuccess\"],[\"static-attr\",\"value\",\"Thank you! You will be contacted with in 1 business day\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n              \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n      \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\" \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"nameErr\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\" \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                    \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"nameErr\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-info\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Contact Information\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"fname\"],[\"flush-element\"],[\"text\",\"First Name:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"id\",\"required\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"fname\"]],\"fname\",\"required\"]]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"nameErr\"]]],null,4,3],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"lname\"],[\"flush-element\"],[\"text\",\"Last Name:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"id\",\"required\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"lname\"]],\"lname\",\"required\"]]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"nameErr\"]]],null,2,1],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"flush-element\"],[\"text\",\"Email Address:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"value\",\"require\"],[\"email\",\"form-control focusedInput\",\"email\",[\"get\",[\"email\"]],\"required\"]]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"phone\"],[\"flush-element\"],[\"text\",\"Best Contact Number:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"value\"],[\"phone\",\"form-control focusedInput\",\"phone\",[\"get\",[\"phone\"]]]]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"skype\"],[\"flush-element\"],[\"text\",\"Skype Id:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"value\"],[\"text\",\"form-control focusedInput\",\"skype\",[\"get\",[\"skype\"]]]]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Preferred Contact Method:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radio\"],[\"static-attr\",\"id\",\"method\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Email\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Phone\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Text\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Text\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Skype\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Skype\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"Facetime\",[\"get\",[\"selectedContctMethd\"]]]]],false],[\"text\",\"Facetime\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"request\"],[\"flush-element\"],[\"text\",\"Question:\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"textarea\"],null,[[\"class\",\"rows\",\"id\",\"value\"],[\"form-control\",\"5\",\"request\",[\"get\",[\"request\"]]]]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-3\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"append\",[\"unknown\",[\"yeild\"]],false],[\"text\",\"\\n                 \"],[\"append\",[\"helper\",[\"submit-button\"],null,[[\"text\",\"value\",\"onSubmit\"],[\"Submit\",\"Submit\",[\"helper\",[\"action\"],[[\"get\",[null]],\"createContact\"],null]]]],false],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"col-lg-10 pull-left\"],[\"flush-element\"],[\"text\",\"For General Inquires select \"],[\"open-element\",\"b\",[]],[\"flush-element\"],[\"text\",\"\\\"Contact Us\\\"\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/contact-us.hbs" } });
});
define("imanjesolutions/templates/components/content-container", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "4xxBXtdd", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"content-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"footer-comp\"]],false],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/content-container.hbs" } });
});
define("imanjesolutions/templates/components/folio-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Pj47u3pf", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container folio\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"folio-title_row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"folio-title\"],[\"flush-element\"],[\"text\",\"GALLERY\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row gallery-row\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"mCard\"]]],null,5],[\"block\",[\"if\"],[[\"get\",[\"mCard\"]]],null,4],[\"block\",[\"if\"],[[\"get\",[\"mCard\"]]],null,3],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"<div class=\\\"row\\\">\\n{{# if mCard}}\\n        <div class=\\\"col-lg-3 card\\\">\\n            <img src=\\\"/assets/images/folio-vernadre.png\\\" alt=\\\"VernadreShenae Artistry\\\" />\\n            <div class=\\\"card-link\\\" onclick={{action 'showDesktop' 'dCard4'}}><span>Desktop View</span><img src=\\\"/assets/images/ultraviewer.ico\\\" class=\\\"card-icon\\\"/></div>\\n        </div>\\n    {{/if}}{{# if mCard}}\\n        <div class=\\\"col-lg-3 card\\\">\\n            <img src=\\\"/assets/images/folio-supersonics.png\\\" alt=\\\"Lilburn SuperSonics\\\" />\\n            <div class=\\\"card-link\\\" onclick={{action 'showDesktop' 'dCard5'}}><span>Desktop View</span><img src=\\\"/assets/images/ultraviewer.ico\\\" class=\\\"card-icon\\\"/></div>\\n        </div>\\n    {{/if}}{{# if mCard}}\\n        <div class=\\\"col-lg-3 card\\\">\\n            <img src=\\\"/assets/images/folio-vernadre.png\\\" alt=\\\"VernadreShenae Artistry\\\" />\\n            <div class=\\\"card-link\\\" onclick={{action 'showDesktop' 'dCard6'}}><span>Desktop View</span><img src=\\\"/assets/images/ultraviewer.ico\\\" class=\\\"card-icon\\\"/></div>\\n        </div>\\n    {{/if}}    </div>\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"dCard1\"]]],null,2],[\"block\",[\"if\"],[[\"get\",[\"dCard2\"]]],null,1],[\"block\",[\"if\"],[[\"get\",[\"dCard3\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"desktopview-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-1 col-md-6col-lg-offset-3 col-lg-5 card-desktop\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-lilburnssDesktop.png\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"closeDesktop\",\"dCard3\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Mobile View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"desktopview-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-1 col-md-6col-lg-offset-3 col-lg-5 card-desktop\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-desktopVSA.png\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"closeDesktop\",\"dCard2\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Mobile View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"desktopview-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-1 col-md-6 col-lg-offset-3 col-lg-5 card-desktop\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-imanjeDesktopLanding.png\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"closeDesktop\",\"dCard1\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Mobile View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-3 card\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-supersonics.png\"],[\"static-attr\",\"alt\",\"Lilburn SuperSonics\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showDesktop\",\"dCard3\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Desktop View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-3 card\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-vernadre.png\"],[\"static-attr\",\"alt\",\"VernadreShenae Artistry\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showDesktop\",\"dCard2\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Desktop View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-3 card\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/folio-imanje.png\"],[\"static-attr\",\"alt\",\"Imanje Solutions\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-link\"],[\"dynamic-attr\",\"onclick\",[\"helper\",[\"action\"],[[\"get\",[null]],\"showDesktop\",\"dCard1\"],null],null],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\"Desktop View\"],[\"close-element\"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/ultraviewer.ico\"],[\"static-attr\",\"class\",\"card-icon\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/folio-content.hbs" } });
});
define("imanjesolutions/templates/components/footer-comp", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "HFIAXF5F", "block": "{\"statements\":[[\"open-element\",\"footer\",[]],[\"static-attr\",\"class\",\"footer\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isIndex\"]]],null,8,7],[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"footer-content\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"footer-contact_group\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"footer-contact_text\"],[\"flush-element\"],[\"text\",\"Contact Us:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"footer-contact_phone\"],[\"flush-element\"],[\"text\",\"ph:\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"tel:+14705350600\"],[\"flush-element\"],[\"text\",\"470-535-0600\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"footer-contact_email\"],[\"flush-element\"],[\"text\",\"email: \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"mailto:imanjesolutions@gmail.com?subject=Question\"],[\"flush-element\"],[\"text\",\"imanjesolutions@gmail.com\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"footer-nav-row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"nav\",[]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"footer-nav\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"home\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],6],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"about\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],5],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],4],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],3],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"folio\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],2],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"index\"],[[\"tagName\",\"class\"],[\"li\",\"footer--navlink\"]],1],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"footer-freeq_col\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\",\"class\"],[\"a\",\"footer--imglink\"]],0],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"footer-copy_column\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"footer-copyright\"],[\"flush-element\"],[\"text\",\" © IMANJE SOLUTIONS 2017\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/freequote.png\"],[\"static-attr\",\"alt\",\"Free Quote\"],[\"static-attr\",\"class\",\"footer-img\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Index\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Folio\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Contact Us\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Services\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"id\",\"top\"],[\"static-attr\",\"class\",\"btn btn-primary pull-right toTop footer-button\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-arrow-up\"],[\"flush-element\"],[\"text\",\"Back to Top\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"id\",\"top\"],[\"static-attr\",\"class\",\"btn btn-primary pull-right toTop footer-button footer-hide\"],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"fa fa-arrow-up\"],[\"flush-element\"],[\"text\",\"Back to Top\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/footer-comp.hbs" } });
});
define("imanjesolutions/templates/components/header-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+snSma0n", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-column header\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row mblNav-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-12 rectangle_1\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"navbar-mbl_menu\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"navbar-toggle collapsed\"],[\"static-attr\",\"data-toggle\",\"collapse\"],[\"static-attr\",\"data-target\",\"#mobile-navbar\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Toggle navigation\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n\"],[\"text\",\"            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse col-md-6\"],[\"static-attr\",\"id\",\"mobile-navbar\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav nav-pills nav-stacked\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"home\"],[[\"tagName\",\"class\"],[\"li\",\"\"]],4],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"about\"],[[\"tagName\",\"class\"],[\"li\",\"\"]],3],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\",\"class\"],[\"li\",\"\"]],2],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\",\"class\"],[\"li\",\"\"]],1],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"folio\"],[[\"tagName\",\"class\"],[\"li\",\"\"]],0],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row header-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"logo-column\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/aboutLogo.png\"],[\"static-attr\",\"alt\",\"Imanje Solutions\"],[\"static-attr\",\"class\",\"header-logo\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"name-column\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"name\"],[\"flush-element\"],[\"text\",\"IMANJE SOLUTIONS\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"ee___Mon___jay\"],[\"flush-element\"],[\"text\",\"(ee - Mon - jay)  (so - lu - tions)\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"header-call_box\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/callNowBg.png\"],[\"static-attr\",\"alt\",\"470-535-0600\"],[\"static-attr\",\"class\",\"header-call_img\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"header-call_text\"],[\"flush-element\"],[\"text\",\"CALL NOW\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"hr\",[]],[\"static-attr\",\"class\",\"header-call_line\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"header-call_number\"],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"tel:+14705350600\"],[\"flush-element\"],[\"text\",\"470-535-0600\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row rectangle-row\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-12 rectangle_2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"moto\"],[\"flush-element\"],[\"text\",\"Tomorrow's Solutions For Today's Problems\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Folio\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Contact Us\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Services\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/header-content.hbs" } });
});
define("imanjesolutions/templates/components/hme-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6ch2gvEh", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-2 col-lg-8\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"intro intro-top\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"intro-bold\"],[\"flush-element\"],[\"text\",\"Imanje Solutions\"],[\"close-element\"],[\"text\",\", located in \"],[\"open-element\",\"i\",[]],[\"flush-element\"],[\"text\",\"Lawrenceville,GA\"],[\"close-element\"],[\"text\",\" is a web consulting firm whose goal is providing sound,\\n            innovative solutions for your Website, Web App, Social Networking and Branding\\n            needs. If your needs are a modern innovative web solution from start to finish, or some extra\\n            hands to steer your project across the finish line, Imanje Solutions is here to help.\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"intro-row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isWebdesign\"]]],null,12],[\"block\",[\"if\"],[[\"get\",[\"showWebdesign\"]]],null,11],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isWebApp\"]]],null,10],[\"block\",[\"if\"],[[\"get\",[\"showWebApp\"]]],null,9],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isSocial\"]]],null,8],[\"block\",[\"if\"],[[\"get\",[\"showSocial\"]]],null,7],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-2\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isBranding\"]]],null,6],[\"block\",[\"if\"],[[\"get\",[\"showBranding\"]]],null,5],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-1 col-lg-1 info-link_mobile\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\"],[\"a\"]],4],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"d-flex flex-row more-info-row\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"comment\",\"  <div class=\\\"col-lg-offset-1 col-lg-1 info-link_mobile\\\">\\n        {{#link-to 'services' tagName=\\\"a\\\"}}<a href=\\\"\\\" alt=\\\"For More Info\\\">For More Info</a>{{/link-to}}\\n    </div>\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-link info-link_one\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\"],[\"a\"]],3],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-link info-link_two\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\"],[\"a\"]],2],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-link info-link_three\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\"],[\"a\"]],1],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-link info-link_four\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\"],[\"a\"]],0],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"More Info\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"More Info\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"More Info\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"For More Info\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"For More Info\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square yellowSqr-box\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleBrand\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"mintSqr1-list_title\"],[\"flush-element\"],[\"text\",\"Branding Services\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mintSqr1-list\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Logo Design\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Graphic Design\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Business Cards\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Flyers\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Brochures\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square yellowSqr\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleBrand\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"info-square_text\"],[\"flush-element\"],[\"text\",\"Branding Services\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"Click Here\"],[\"static-attr\",\"class\",\"intro-click-text\"],[\"flush-element\"],[\"text\",\"Click Here\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square purpleSqr-box\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleSocial\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"mintSqr1-list_title\"],[\"flush-element\"],[\"text\",\"Social Media Marketing\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mintSqr1-list\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"SEO\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Facebook\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Twitter\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Youtube\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"E-mail Campaigns\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square purpleSqr\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleSocial\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"info-square_text\"],[\"flush-element\"],[\"text\",\"Social Media Marketing\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"Click Here\"],[\"static-attr\",\"class\",\"intro-click-text\"],[\"flush-element\"],[\"text\",\"Click Here\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square skySqr1-box\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleApp\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"mintSqr1-list_title\"],[\"flush-element\"],[\"text\",\"Web App Development\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mintSqr1-list\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Web App Design & Development\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"JavaScript Solutions Design & Development\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"New Features and Issue Resolution\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Database Development\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square skySqr1\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleApp\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"info-square_text\"],[\"flush-element\"],[\"text\",\"Web App Development\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"Click Here\"],[\"static-attr\",\"class\",\"intro-click-text\"],[\"flush-element\"],[\"text\",\"Click Here\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square mintSqr1-box\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleSquare\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"mintSqr1-list_title\"],[\"flush-element\"],[\"text\",\"Web Design Services\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"mintSqr1-list\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Web Design and Development\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Responsive and Mobile Design\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"WordPress Development\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Web Upgrades, Maintenance, Troubleshooting\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"E-Commerce\"],[\"close-element\"],[\"text\",\"\\n                    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Cross Browser Compliant\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-square mintSqr1\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleSquare\"]],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"info-square_text\"],[\"flush-element\"],[\"text\",\"Web Design\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"Click Here\"],[\"static-attr\",\"class\",\"intro-click-text\"],[\"flush-element\"],[\"text\",\"Click Here\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/hme-content.hbs" } });
});
define("imanjesolutions/templates/components/landing-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "BgLzbgyC", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\" container-fluid landing-container\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-5 col-lg-4 landing-min-height\"],[\"flush-element\"],[\"text\",\"\\n          \"],[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/logo.png\"],[\"static-attr\",\"alt\",\"Imanje Solutions\"],[\"static-attr\",\"class\",\"landing-img\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-sm-offset-2 col-sm-8 col-lg-offset-4 col-lg-4\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"landing-intro_text landing-intro-top text-center\"],[\"flush-element\"],[\"text\",\"\\n            Need a Website, Web App, Social Media Marketing or Branding Services.\\n            Contact \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"intro-bold\"],[\"flush-element\"],[\"text\",\"Imanje Solutions NOW.\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row intro-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row enterbtn-row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-xs-offset-2 col-sm-offset-0  col-lg-offset-0 col-lg-6 landing-enter_button\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"home\"],[[\"tagName\"],[\"a\"]],0],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"yield\",\"default\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"static-attr\",\"alt\",\"For More Info\"],[\"flush-element\"],[\"text\",\"ENTER\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/landing-content.hbs" } });
});
define("imanjesolutions/templates/components/legit-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "OTn4uMR7", "block": "{\"statements\":[[\"block\",[\"lf-form\"],null,[[\"rules\",\"data\",\"validityChanged\"],[[\"get\",[\"rules\"]],[\"get\",[\"data\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"isValid\"]]],null]],null]]],0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"lf-input\"],null,[[\"name\",\"label\",\"property\",\"on-update\",\"validate\"],[\"name\",\" Your Name:\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"firstName\"]]],null]],null],[\"get\",[\"validateFunc\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"validateFunc\"]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/legit-form.hbs" } });
});
define("imanjesolutions/templates/components/legit-quote", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "VyjfdZW+", "block": "{\"statements\":[[\"block\",[\"lf-form\"],null,[[\"rules\",\"data\",\"validityChanged\"],[[\"get\",[\"rules\"]],[\"get\",[\"data\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"isValid\"]]],null]],null]]],0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"lf-input\"],null,[[\"name\",\"label\",\"property\",\"on-update\",\"validate\"],[\"name\",\" Your Name:\",[\"get\",[\"model\",\"name\"]],[\"helper\",[\"action\"],[[\"get\",[null]],[\"helper\",[\"mut\"],[[\"get\",[\"model\",\"firstName\"]]],null]],null],[\"get\",[\"validateFunc\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"validateFunc\"]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/legit-quote.hbs" } });
});
define('imanjesolutions/templates/components/modal-dialog', ['exports', 'ember-modal-dialog/templates/components/modal-dialog'], function (exports, _emberModalDialogTemplatesComponentsModalDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogTemplatesComponentsModalDialog['default'];
    }
  });
});
define("imanjesolutions/templates/components/my-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "E2iDZ5jt", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal fade\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-dialog\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-content\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-header\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"close\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"static-attr\",\"aria-hidden\",\"true\"],[\"flush-element\"],[\"text\",\"×\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"h4\",[]],[\"static-attr\",\"class\",\"modal-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"title\"]],false],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-body\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"yield\",\"default\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-footer\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"flush-element\"],[\"text\",\"Close\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"ok\"]],[\"flush-element\"],[\"text\",\"OK\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/my-modal.hbs" } });
});
define("imanjesolutions/templates/components/nav-bar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "qvWZM+S9", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"comment\",\"<div class=\\\"container-fluid\\\">\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row nav-row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse col-md-6\"],[\"static-attr\",\"id\",\"main-navbar\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav header__nav-list\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"block\",[\"link-to\"],[\"home\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],4],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"about\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],3],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],2],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],1],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"folio\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],0],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"comment\",\" /.navbar-collapse \"],[\"text\",\"\\n    \"],[\"comment\",\"</div>&lt;!&ndash; /.container-fluid &ndash;&gt;\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Folio\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Contact Us\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Services\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/nav-bar.hbs" } });
});
define("imanjesolutions/templates/components/quote-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "KJUvHv/m", "block": "{\"statements\":[[\"text\",\"\\n\\n\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showQuoteFm\"]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Quote\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"notSubmit\"]]],null,4],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isQuote\"]]],null,3],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isSubmitted\"]]],null,0],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group has-success has-feedback col-lg-12 success-fix\"],[\"flush-element\"],[\"text\",\"\\n\\n        \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"text\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"id\",\"inputSuccess\"],[\"static-attr\",\"value\",\"Thank you! You will be contacted with in 1 business day\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"text\",\" \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"span\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"nameErr\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel panel-info\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"panel-heading\"],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Quote Information\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n     \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"panel-body\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"name\"],[\"flush-element\"],[\"text\",\"Your Name:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"required\"],[\"text\",\"form-control\",[\"get\",[\"name\"]],\"required\"]]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"nameErr\"]]],null,2,1],[\"text\",\"        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"flush-element\"],[\"text\",\"Email Address:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"email\",\"form-control focusedInput\",[\"get\",[\"email\"]],\"required\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"phone\"],[\"flush-element\"],[\"text\",\"Phone Number:\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"tel\",\"form-control focusedInput\",[\"get\",[\"phone\"]],\"required\"]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"about\"],[\"flush-element\"],[\"text\",\"In short, what this project is about?\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"about\"]],\"required\"]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"budget\"],[\"flush-element\"],[\"text\",\"What is your budget?\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radio\"],[\"static-attr\",\"id\",\"budget\"],[\"flush-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"100-500\",[\"get\",[\"selectedBudget\"]]]]],false],[\"text\",\"$100-$500\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"500-800\",[\"get\",[\"selectedBudget\"]]]]],false],[\"text\",\"$500-$800\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"800-1500\",[\"get\",[\"selectedBudget\"]]]]],false],[\"text\",\"$800-$1500\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"1500-5000\",[\"get\",[\"selectedBudget\"]]]]],false],[\"text\",\"$1500-$5000\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"5000-10000\",[\"get\",[\"selectedBudget\"]]]]],false],[\"text\",\"$5000-$10000\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"webaddress\"],[\"flush-element\"],[\"text\",\"What is your current/intended website address? e.g. wwww.yourwebsite.com\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"web_address\"]]]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"pages\"],[\"flush-element\"],[\"text\",\"Approximately how many pages/sections will your site have?\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"radio\"],[\"static-attr\",\"id\",\"pages\"],[\"flush-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"100-500\",[\"get\",[\"selectedPages\"]]]]],false],[\"text\",\"1-4\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"500-800\",[\"get\",[\"selectedPages\"]]]]],false],[\"text\",\"5-10\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"800-1500\",[\"get\",[\"selectedPages\"]]]]],false],[\"text\",\"10-20\"],[\"close-element\"],[\"text\",\"\\n                 \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"append\",[\"helper\",[\"radio-button\"],null,[[\"type\",\"name\",\"value\",\"checked\"],[\"radio\",\"optradio\",\"1500-5000\",[\"get\",[\"selectedPages\"]]]]],false],[\"text\",\"20+\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"description\"],[\"flush-element\"],[\"text\",\"How should visitors describe your new site?\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"require\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"description\"]],\"required\"]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"features\"],[\"flush-element\"],[\"text\",\"Name some specific features/functionality.\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"features\"]]]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"examples\"],[\"flush-element\"],[\"text\",\"Are there any particular sites that you like?.\"],[\"close-element\"],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"example1\"]]]]],false],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"example2\"]]]]],false],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\"],[\"text\",\"form-control focusedInput\",[\"get\",[\"example3\"]]]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n         \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n             \"],[\"append\",[\"unknown\",[\"yeild\"]],false],[\"text\",\"\\n             \"],[\"append\",[\"helper\",[\"submit-button\"],null,[[\"text\",\"value\",\"onSubmit\"],[\"Submit\",\"Submit\",[\"helper\",[\"action\"],[[\"get\",[null]],\"createQuote\"],null]]]],false],[\"text\",\"\\n         \"],[\"close-element\"],[\"text\",\"\\n     \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"col-lg-10 pull-left\"],[\"flush-element\"],[\"text\",\" For A Detailed Quote select \"],[\"open-element\",\"b\",[]],[\"flush-element\"],[\"text\",\"\\\"Quote\\\"\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/quote-form.hbs" } });
});
define("imanjesolutions/templates/components/quotes-list", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YPIU8GTV", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"theader\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"Quotes\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"Column Headers\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"trow\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"comment\",\"ID\"],[\"text\",\"\\n    \"],[\"comment\",\"<div class=\\\"tcol-1\\\">\"],[\"text\",\"\\n        \"],[\"comment\",\"<span class=\\\"table-header\\\">ID</span>\"],[\"text\",\"\\n    \"],[\"comment\",\"</div>\"],[\"text\",\"\\n    \"],[\"comment\",\"Name\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Email\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Phone\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Phone\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Skype\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-3\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Method\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header tooltip\"],[\"flush-element\"],[\"text\",\"Web Address\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"comment\",\"Request\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-header\"],[\"flush-element\"],[\"text\",\"Budget\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"comment\",\"Contacts List\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"quotes\"]]],null,2],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isShowingModal\"]],[\"get\",[\"quote\"]]],null,1],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"close\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"static-attr\",\"aria-hidden\",\"true\"],[\"flush-element\"],[\"text\",\"×\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"ok\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"value\",\"placeholder\"],[\"text\",\"form-control\",[\"get\",[\"qt\",\"name\"]],[\"get\",[\"qt\",\"name\"]]]]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"btn-group\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-default\"],[\"static-attr\",\"data-dismiss\",\"modal\"],[\"flush-element\"],[\"text\",\"Close\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"ok\"]],[\"flush-element\"],[\"text\",\"OK\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"modal-dialog\"],null,[[\"close\",\"translucentOverlay\",\"targetAttachment\",\"container-class\",\"overlay-class\",\"wrapper-class\"],[\"toggleCenteredScrolling\",true,\"none\",\"centered-scrolling-container\",\"centered-scrolling-overlay\",\"centered-scrolling-wrapper\"]],0]],\"locals\":[\"qt\"]},{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"trow\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"comment\",\"ID\"],[\"text\",\"\\n        \"],[\"comment\",\"<div class=\\\"tcol-1\\\">\"],[\"text\",\"\\n            \"],[\"comment\",\"<span class=\\\"table-cell\\\"></span>\"],[\"text\",\"\\n        \"],[\"comment\",\"</div>\"],[\"text\",\"\\n        \"],[\"comment\",\"Name\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"dynamic-attr\",\"data-id\",[\"unknown\",[\"quote\",\"id\"]],null],[\"modifier\",[\"action\"],[[\"get\",[null]],\"showModal\",[\"get\",[\"quote\",\"id\"]]]],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"name\"]],false],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Email\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Phone\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"phone\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Skype\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-3\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"about\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Method\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-2\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"web_address\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"comment\",\"Request\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"tcol-1\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"table-cell\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"quote\",\"budget\"]],false],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\\n\"]],\"locals\":[\"quote\"]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/quotes-list.hbs" } });
});
define("imanjesolutions/templates/components/quotes-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "W3vqzrr0", "block": "{\"statements\":[[\"block\",[\"my-modal\"],null,[[\"title\",\"ok\",\"close\"],[\"Quotes\",\"save\",\"removeModal\"]],0]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"form\",[]],[\"modifier\",[\"action\"],[[\"get\",[null]],\"ok\"],[[\"on\",\"target\"],[\"submit\",[\"get\",[\"view\"]]]]],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"label\",[]],[\"flush-element\"],[\"text\",\"Name\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"value\"],[\"form-control\",[\"get\",[\"record\",\"name\"]]]]],false],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/quotes-modal.hbs" } });
});
define("imanjesolutions/templates/components/services-content", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "+8MgDWWC", "block": "{\"statements\":[[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"text-center services-title container-top\"],[\"flush-element\"],[\"text\",\"What We Do\"],[\"close-element\"],[\"text\",\"\\n\"],[\"comment\",\"<div class=\\\"text-center about-logo__height\\\">\\n    <img src=\\\"/assets/images/aboutLogo.png\\\" alt=\\\"Imanje Solutions\\\" class=\\\"about-logo\\\"/>\\n</div>\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid services-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row text-center\"],[\"flush-element\"],[\"text\",\"\\n     \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-2 col-md-8  col-lg-offset-3 col-lg-6  service-drawer web\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isActive\"]]],null,7,6],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"Id\",\"dev\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"titleClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Website Development\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"services__list isActive  \",[\"helper\",[\"if\"],[[\"get\",[\"isActive\"]],\"dev-open\",\"notactive\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Custom Website Design and Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Responsive and Mobile Design\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Wordpress Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"E-commerce\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Website Maintenance, Repair and Upgrades\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Web Hosting\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n     \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row text-center\"],[\"flush-element\"],[\"text\",\"\\n       \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-2 col-md-8  col-lg-offset-3 col-lg-6  service-drawer\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isApps\"]]],null,5,4],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"appsClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"id\",\"app\"],[\"flush-element\"],[\"text\",\"Web Applications\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"services__list apps \",[\"helper\",[\"if\"],[[\"get\",[\"isApps\"]],\"dev-open\",\"notactive\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Mobile Web Applications - Deisgn and Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"SPA - Single Page Applications Deisgn and Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"JavaScript Solutions - Design and Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"New Features/Issue Resolution - Need a new feature or Issued resolved for your app\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Database - Design and Development\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Web Services and API Development\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n       \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n   \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row text-center\"],[\"flush-element\"],[\"text\",\"\\n     \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-2 col-md-8  col-lg-offset-3 col-lg-6  service-drawer\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isNet\"]]],null,3,2],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"netClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"id\",\"net\"],[\"flush-element\"],[\"text\",\"Social Media Marketing\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"services__list net \",[\"helper\",[\"if\"],[[\"get\",[\"isNet\"]],\"dev-open\",\"notactive\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"SEO/Google Analytics\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Facebook\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Twitter\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Youtube\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Instagram\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"E-mail Campaigns\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n     \"],[\"close-element\"],[\"text\",\"\\n   \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row text-center\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6  service-drawer brand\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isBrand\"]]],null,1,0],[\"text\",\"        \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"brandClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"id\",\"brand\"],[\"flush-element\"],[\"text\",\"Branding Services\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"ul\",[]],[\"dynamic-attr\",\"class\",[\"concat\",[\"services__list net \",[\"helper\",[\"if\"],[[\"get\",[\"isBrand\"]],\"dev-open\",\"notactive\"],null]]]],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Graphic Design\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Logo Design\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Business Cards\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"Flyers & Brochures\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"text\",\"T-shirts & Hats\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"             \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"brandClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-plus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"             \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"brandClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-minus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"netClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-plus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"            \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"netClick\",[\"get\",[null]]]],[\"flush-element\"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-minus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"appsClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-plus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"              \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"appsClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-minus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"             \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"Id\",\"dev\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"titleClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-plus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"             \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"static-attr\",\"Id\",\"dev\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"titleClick\",[\"get\",[null]]]],[\"flush-element\"],[\"text\",\" \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-minus pull-right plus-button\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/services-content.hbs" } });
});
define("imanjesolutions/templates/components/simple-modal", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Jg5GrxV6", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isEnabled\"]]],null,0]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-fog\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-frame\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-title\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"append\",[\"unknown\",[\"title\"]],false],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"modal-body\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"a\",[]],[\"static-attr\",\"title\",\"Close\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"toggleModal\"]],[\"flush-element\"],[\"open-element\",\"i\",[]],[\"static-attr\",\"class\",\"glyphicon glyphicon-remove icon-arrow-right pull-right pointer\"],[\"flush-element\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"yield\",\"default\"],[\"text\",\"\\n\\n\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/simple-modal.hbs" } });
});
define("imanjesolutions/templates/components/submit-button", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "k1O7Vz4H", "block": "{\"statements\":[[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-info pull-right btn-right-mgrn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submitForm\"]],[\"flush-element\"],[\"text\",\"Submit\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/submit-button.hbs" } });
});
define('imanjesolutions/templates/components/tether-dialog', ['exports', 'ember-modal-dialog/templates/components/tether-dialog'], function (exports, _emberModalDialogTemplatesComponentsTetherDialog) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberModalDialogTemplatesComponentsTetherDialog['default'];
    }
  });
});
define("imanjesolutions/templates/components/thank-you", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ZMY8Nn9a", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-3 col-lg-9\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Thank You\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-3 col-lg-6\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Thank you for your inquiry. We are hard at work researching your question. A professional\\n        will contact you within 48 hour, by your preferred contact method. Note for Skype users an email\\n        will be sent to set up an appointment for a consultation.\"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"p\",[]],[\"flush-element\"],[\"text\",\"Thank you for choosing Imanje Solutions.\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-lg-offset-6 col-lg-3\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"block\",[\"link-to\"],[\"index\"],[[\"tagName\",\"class\"],[\"h3\",\"title\"]],0],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/components/thank-you.hbs" } });
});
define("imanjesolutions/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ASD79ke+", "block": "{\"statements\":[[\"comment\",\"This page is for the customer forms Contact and Quotes\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"yeild\"]],false],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-xs-offset-1 col-md-offset-1 col-md-5\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"      \"],[\"append\",[\"helper\",[\"contact-us\"],null,[[\"data\"],[[\"get\",[\"model\",\"contact\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-xs-offset-1 col-md-5 quote-link\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"text\",\"        \"],[\"append\",[\"helper\",[\"quote-form\"],null,[[\"data\"],[[\"get\",[\"model\",\"quote\"]]]]],false],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/contact.hbs" } });
});
define("imanjesolutions/templates/contacts", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "6AhF+CBQ", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"admin-nav\"]],false],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row t-table\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"contact-list\"]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/contacts.hbs" } });
});
define("imanjesolutions/templates/contacts/inquiries", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "9FPzssph", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"contact-list\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/contacts/inquiries.hbs" } });
});
define("imanjesolutions/templates/container", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "mPYvvkOR", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"content-container\"],[\"flush-element\"],[\"text\",\"\\n \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"footer-comp\"]],false],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/container.hbs" } });
});
define("imanjesolutions/templates/folio", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "TzJX+Uxf", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"folio-content\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/folio.hbs" } });
});
define("imanjesolutions/templates/home", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "ciW248qs", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"hme-content\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/home.hbs" } });
});
define("imanjesolutions/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0TY6vrHi", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"landing-content\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/index.hbs" } });
});
define("imanjesolutions/templates/login", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "pNg8lb2H", "block": "{\"statements\":[[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"form-signin\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Email address\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"email\"],[\"static-attr\",\"id\",\"email\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"placeholder\",\"Email Address\"],[\"static-attr\",\"autofocus\",\"\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"password\"],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Password\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"input\",[]],[\"static-attr\",\"type\",\"password\"],[\"static-attr\",\"id\",\"password\"],[\"static-attr\",\"class\",\"form-control\"],[\"static-attr\",\"placeholder\",\"Password\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-primary btn-block btn-lg\"],[\"static-attr\",\"type\",\"submit\"],[\"flush-element\"],[\"text\",\"Sign In\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"admin\"],[[\"tagName\",\"class\"],[\"a\",\"\"]],0],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Sign In\"],[\"close-element\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/login.hbs" } });
});
define("imanjesolutions/templates/navbar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "dqAaUfG5", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-inverse navbar-fixed-top\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"navbar-header\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"button\"],[\"static-attr\",\"class\",\"navbar-toggle collapsed\"],[\"static-attr\",\"data-toggle\",\"collapse\"],[\"static-attr\",\"data-target\",\"#main-navbar\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Toggle navigation\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"block\",[\"link-to\"],[\"index\"],[[\"class\"],[\"navbar-brand brand-height\"]],5],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-offset-2 col-lg-offset-3 col-md-6\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"header__title\"],[\"flush-element\"],[\"text\",\"IMANJE SOLUTIONS\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"header__byline\"],[\"flush-element\"],[\"text\",\"(ee-Mon-jay) (so-lu-tions)\"],[\"close-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"p\",[]],[\"static-attr\",\"class\",\"header__motto header__motto--font\"],[\"flush-element\"],[\"text\",\"Tomorrow's Solutions for Today's Problems\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"row\"],[\"flush-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse col-md-offset-3 col-lg-offset-4 col-md-6\"],[\"static-attr\",\"id\",\"main-navbar\"],[\"flush-element\"],[\"text\",\"\\n                \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav header__nav-list\"],[\"flush-element\"],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"index\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],4],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"about\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],3],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"services\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],2],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"contact\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],1],[\"text\",\"\\n                    \"],[\"block\",[\"link-to\"],[\"login\"],[[\"tagName\",\"class\"],[\"li\",\"header--navbtn\"]],0],[\"text\",\"\\n                \"],[\"close-element\"],[\"text\",\"\\n            \"],[\"close-element\"],[\"text\",\"\\n        \"],[\"close-element\"],[\"comment\",\" /.navbar-collapse \"],[\"text\",\"\\n    \"],[\"close-element\"],[\"comment\",\" /.container-fluid \"],[\"text\",\"\\n\"],[\"close-element\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Login\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Contact Us\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Services\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"About\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"\"],[\"flush-element\"],[\"text\",\"Home\"],[\"close-element\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"img\",[]],[\"static-attr\",\"src\",\"/assets/images/logo.png\"],[\"static-attr\",\"alt\",\"Imanje Solutions\"],[\"flush-element\"],[\"close-element\"],[\"text\",\" \"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/navbar.hbs" } });
});
define("imanjesolutions/templates/services", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "HGuL8ZDF", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"services-content\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/services.hbs" } });
});
define("imanjesolutions/templates/thankyou", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0FF9QFND", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n\"],[\"append\",[\"unknown\",[\"thank-you\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "imanjesolutions/templates/thankyou.hbs" } });
});
define('imanjesolutions/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});


define('imanjesolutions/config/environment', ['ember'], function(Ember) {
  var prefix = 'imanjesolutions';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("imanjesolutions/app")["default"].create({"name":"imanjesolutions","version":"0.0.0+de1e6f31"});
}
//# sourceMappingURL=imanjesolutions.map
