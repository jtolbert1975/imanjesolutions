import Ember from 'ember';

export default Ember.Component.extend({

    actions: {
        showTab(tabName){

            let tname = tabName;
            this.sendAction('myAction', tname);
            return true;
        }
    }
});
