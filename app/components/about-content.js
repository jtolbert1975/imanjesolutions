import Ember from 'ember';

export default Ember.Component.extend({

    routing: Ember.inject.service('-routing'),
    isIndex: '',

    didInsertElement(){
        //Hide Back To Top button on Index view
        let daRoute = this.get('routing.currentRouteName');

        console.log("This is the Route: ", daRoute);

        if(daRoute === 'index'){
            this.set('isIndex', true);
        } else{
            console.log("Hello You are Not Index");
            this.set('isIndex', false);
        }
    }
});
