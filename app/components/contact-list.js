import Ember from 'ember';

export default Ember.Component.extend({
   store: Ember.inject.service(),
    selectedQuote:   '',

    init(){
        this._super();
        this.initialize();

    },


    initialize() {
        //sets the promise
        this.contactList().then((data) => {
            //the callback
            this.set('contactEntries', data);
        });
    },

    contactList(){
          const store = this.get('store');

        return store.findAll('contacts');
    },

    actions:{
        getID: function(){
          let id =  Ember.$('input[name=optradio]:checked').val();
              //this.get('selectedQuote');
            console.log("The Id is: ",id );
            this.send('getContact', id);
        },

        getContact: function(id){
            let contactId = id;
            console.log("Get Contact: ",contactId );
           // const store = this.get('store');
            //let contact = store.findRecord('contacts' ,contactId);

            this.contactFound(contactId).then((data) => {
               var  contactData =  data;

                console.log("The contact is: ", contactData);
                this.send('saveQuote', contactData);

                    //this.set('contactData', data);
            });


        },

        saveQuote(contactData){
            console.log("YOu called saveQuote:", contactData);

            let record = contactData.data;
            let f_name = record.f_name;
            let l_name = record.l_name;
            let name = f_name + " " + l_name;
            let email = record.email;
            let contactMethod =   record.contactMethd;
            let phone = record.phone;
            let description = record.request;
            let skype = record.skype;



            Ember.LOGGER.Logger("Contact Method: " + contactMethod);
            Ember.LOGGER.Logger("Contact Method: " + skype);

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

    contactFound(contactId){
        console.log("You called Contact Found");

        const store = this.get('store');
        return store.findRecord('contacts' ,contactId);

    }









});
