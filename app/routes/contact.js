import Ember from 'ember';

export default Ember.Route.extend({
/*    renderTemplate: function(){
        this.render();

        this.render('contact/contact-us', {
            into: 'contact',
            outlet: 'contact-us',
            controller: 'contact'
        });

        this.render('contact/quote-form', {
            into: 'contact',
            outlet: 'quote-form',
            controller: 'quote'
        });
    },*/

    model(){
        return Ember.RSVP.hash({
            contact: this.get('store').findAll('Contacts'),
            quote: this.get('store').findAll('Quotes'),

      });
    },

    setupController(controller, model) {
        this._super(...arguments);
        Ember.set(controller, 'contact', model.contact);
        Ember.set(controller, 'quote', model.quote);
    }
});
