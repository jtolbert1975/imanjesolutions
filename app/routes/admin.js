import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        //return {id: 1, f_name: 'Fakey', l_name: 'McGee'};
        return this.store.findAll('contacts');
    }

});
