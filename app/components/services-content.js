import Ember from 'ember';

export default Ember.Component.extend({
    routing: Ember.inject.service('-routing'),
    isIndex: '',
    isActive: 'false',
    isApps: 'false',
    isNet: 'false',
    isBrand: 'false',


    init(){
        this._super(...arguments);
        this.set('isActive', false);
        this.set('isApps', false);
        this.set('isNet', false);
        this.set('isBrand', false);
    },

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
    },
    actions: {


        titleClick: function(){

            this.toggleProperty('isActive');

        },

        appsClick: function(){
            this.toggleProperty('isApps');
        },

        netClick: function(){
             this.toggleProperty('isNet');
        },
        brandClick: function(){
            this.toggleProperty('isBrand');
        }



    }

});
