import Ember from 'ember';

export default Ember.Component.extend({

    classNames: [`toTop`],
    routing: Ember.inject.service('-routing'),
    isIndex: '',


    init(){
        this._super(...arguments);


    },


    didRender() {
        this._super(...arguments);
        let daRoute = this.get('routing.currentRouteName');

        console.log("This is the Route: ", daRoute);

        if(daRoute === 'index'){
            this.set('isIndex', true);
        } else{
           // console.log("Hello You are Not Index");
            this.set('isIndex', false);
        }
    },

    click: function() {

        window.scrollTo(0,120);
        //alert('Hello World');

    }


});
