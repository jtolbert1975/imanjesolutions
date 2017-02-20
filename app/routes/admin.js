import Ember from 'ember';
//import RSVP from 'rsvp';

export default Ember.Route.extend({


/*    model(){
     return this.store.findAll('contacts');
    }*/

    model(){
    return Ember.RSVP.hash({
       contact: this.store.findAll('contacts'),
       quote: this.get('store').findAll('Quotes'),
        });
     },



});
