import Ember from 'ember';


export default Ember.Component.extend({

    model: function() {
        return {
            contact: [
                {name: ''},
                {email: ''},
                {phone: ''},
                {contactMethd: ''}
            ]

        };
    },

    selectedContctMethd: '',

    actions: {
        submitForm: function(){
            console.log("The form has been submitted");
            //this.set('isEnabled', false);
            //this.send('toggleModal');
           // this.get('onSubmit')();
            this.toggleProperty('isShown');
            this.toggleProperty('isSubmitted');

        },

        toggleModal: function() {
            console.log("You reached the toggle");
            //this.set('isEnabled', false);
            this.toggleProperty('isEnabled');
        }
    }

});
