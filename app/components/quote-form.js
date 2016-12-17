import Ember from 'ember';

export default Ember.Component.extend({
    model: function() {
        return {

            quote: [
                {name: ''}
            ]

        };
    },

    isQuote: 'false',
    isSubmitted: 'false',

    init(){
        this._super(...arguments);
        this.set('isQuote', false);
        this.set('isSubmitted', false);

    },

    actions: {
        //showClick: function (element) {
        //    this.toggleProperty('isShown');
        //},

        openModal: function(target) {
            var modal = this.get('comp-' + target);
            modal.send('toggleModal');
        },

        showQuoteFm: function(){
            this.toggleProperty('isQuote');
        },

        submitQuote: function(){
            this.toggleProperty('isQuote');
            this.toggleProperty('isSubmitted');
           // this.toggleProperty('notSubmit');
        }


    }
});
