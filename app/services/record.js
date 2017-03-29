import Ember from 'ember';

export default Ember.Service.extend({

    store: Ember.inject.service(),



    modalData: function(id){
        console.log("You reached modal Data");


        this.getQuote(id).then((data) => {

        var quote = data.data;

            console.log("This should b the quote", quote);
            //this.set('quote', data);

            return quote;
        });
    },

    getQuote(id){
        console.log("You are getting the quote", id);
        const store = this.get('store');

       // var fQuote = store.findRecord('quotes', id);

        //console.log('The Quote was found ', fQuote);


        return store.findRecord('quotes', id);
    }


});
