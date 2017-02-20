import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),

    init(){
        this._super();
        this.initialize();
        //let store = this.get('store');

        //let contactlist = store.findAll('contacts');

        // console.log("The contact list: " + contactlist);
    },
    initialize() {
        this.quoteList().then((data) => {

            this.set('quotes', data);
        });
    },

    quoteList(){
        const store = this.get('store');


        return store.findAll('quotes');
    }

});
