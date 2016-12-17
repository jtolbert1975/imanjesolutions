import Ember from 'ember';

export default Ember.Component.extend({
    isEnabled: false,
    model: Ember.Object.create({
        name: ''
    }),
    //rules hash for validation
    rules: {
        name: 'required'
    },

    actions: {
        validityChanged(validState){

            if(validState){
                Ember.log(validState);
                this.set('isEnabled', true);
            } else {
                this.set('isEnabled', false);
            }
        }
    }
});
