import Ember from 'ember';

export default Ember.Component.extend({
    //classNameBindings: ['isActive:active:notactive'],
    isActive: 'false',
    isApps: 'false',
    isNet: 'false',


    init(){
        this._super(...arguments);
        this.set('isActive', false);
        this.set('isApps', false);
        this.set('isNet', false);
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
        }



    }

});
