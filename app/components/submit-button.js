import Ember from 'ember';

export default Ember.Component.extend({

    actions:{
        submitForm: function() {
            console.log("You Called submit Form");
            //this.send('createContact', this);
             this.get('onSubmit')();




            //return true;
        }
    }

});
