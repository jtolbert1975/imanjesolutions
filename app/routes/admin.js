import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    store: Ember.inject.service(),

    model: function(){
     return this.store.findAll('contacts');
    }

    //model(){
    //    //return this.get('store').findAll('contacts');
    //
    //return Ember.RSVP.hash({
    //   contact: this.store.findAll('contacts')
    ////quote: this.get('store').findAll('Quotes'),
    //    });
    // },



});
