import Ember from 'ember';
import layout from '../templates/components/simple-modal';

export default Ember.Component.extend({
    isEnabled: false,
    expose: function() {
        var app_controller = this.get('targetObject');
        var exposedName = "comp-" + this.get('id');
        app_controller.set(exposedName, this);
    }.on('init'),
    actions: {
        toggleModal: function() {
           this.toggleProperty('isEnabled');
            this.toggleProperty('isShown');
       }
    },
    layout: layout
});
