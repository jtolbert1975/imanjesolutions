import Ember from 'ember';

export default Ember.Component.extend({

    classNames: [`toTop`],


    didInsertElement(){
       // $("html, body").animate({scrollToTop: 0}, 600);
        //let toTop = this.set('toTop');
    },

    click: function() {

        window.scrollTo(0,120);
        //alert('Hello World');

    }


});
