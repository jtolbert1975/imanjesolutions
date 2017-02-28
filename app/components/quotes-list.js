import Ember from 'ember';

export default Ember.Component.extend({

    store: Ember.inject.service(),
    record: Ember.inject.service('record'),
    isShowingModal: '',
    name: '',

    init(){
        this._super();
        this.initialize();
        this.set('isShowingModal', false);

        //this.modalData();
    },
    initialize() {
        this.quoteList().then((data) => {

            this.set('quotes', data);
        });
    },

    quoteList(){
        const store = this.get('store');


        return store.findAll('quotes');
    },




    actions: {
        showModal: function(id) {
            console.log("You called Show Modal");


          ///var  recd =  this.get('record').modalData(id);
            this.findQuote(id).then((data)=>{
                this.set('quote', data);
            });
           // this.set('name', recd.name);

            console.log("The quote is: ", recd);
            //this.set('quote', recd);
            this.toggleProperty('isShowingModal');
            //this.$().modal('show');
        },

     /*   removeModal: function() {
            this.disconnectOutlet({
                outlet: 'modal',
                parentView: 'quotes-list'
            });
        },*/



    },

    modalData(id, store){
        console.log("You reached modal Data");

       // const store = this.get('store');

           var quote = store.findRecord('quotes', id);

        console.log("You are found the quote", quote);

            return quote;

       // this.getQuote(id).then((data) => {

            //this.set('quote', data);
        //});
    },



     findQuote(id){
        console.log("You are getting the quote", id);
       // const store = this.get('store');
        var foundQuote = this.get('record').modalData(id);
         console.log("GetQuote Returned: ", foundQuote);

        return foundQuote;
    }

});
