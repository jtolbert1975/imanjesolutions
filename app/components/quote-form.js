import Ember from 'ember';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    isQuote: '',
    notSubmit: '',
    isSubmitted: '',
    isValidName: '',
    selectedBudget: '',
    nameErr: function () {
        var name = this.get('name');
        if(Ember.isEmpty(name) || Ember.isBlank(name)){
            this.set('isValidName', false);
            return "required";
        }

        if(name.length < 5) {
            this.set('isValidName', false);
            return "minimum is 5 characters";
        }

        this.set('Name',true);

    }.property('name'),

    disabled: function(){
        var isValidName = this.get('isValidName');

        if(isValidName){
            return false;
        } else {
            return true;
        }
    },
    init(){
        this._super(...arguments);
        this.set('isQuote', false);
        this.set('isSubmitted', false);
        this.set('notSubmit', true);
        this.set('isValidName', true);

    },

    actions: {

        showQuoteFm: function(){
            console.log("Show the Quote Form");

            this.toggleProperty('isQuote');
        },

       /* createQuote: function(){
            console.log("You are Now creating a Quote");

        },*/



        submitQuote: function(){
          //  console.log("YOu submitted a quote");
           // this.toggleProperty('isQuote');
           // this.toggleProperty('isSubmitted');
           // this.toggleProperty('notSubmit');
        },

        createQuote: function(){
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

            //return true;
        },



        toggleModal: function() {
            console.log("You reached the toggle");
            //this.set('isEnabled', false);
            this.toggleProperty('isEnabled');
        }


    }
});
