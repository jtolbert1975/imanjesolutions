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
        }

    },

    contactFound(contactId){
        console.log("You called Contact Found");

        const store = this.get('store');
        return store.findRecord('contacts' ,contactId);

    }









});
