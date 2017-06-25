import Ember from 'ember';

export default Ember.Component.extend({
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
