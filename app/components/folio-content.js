import Ember from 'ember';

export default Ember.Component.extend({
    mCard: true,
    dCard1: false,
    dCard2: false,
    dcard3: '',
    dcard4: '',
    dCard5: '',
    dcard6: '',
    dcard7: '',
    dCard8: '',
    dCard9: '',

    actions:{
        showDesktop: function(card) {

            this.toggleProperty('mCard');

            var selectedCard = card;
            console.log("Desktop View of: " + selectedCard);

            this.send('displayDesk', selectedCard);

        },

        displayDesk: function(selectedCard) {
             let dcard = selectedCard;

             console.log("Now displaying Desktop Card: " + dcard);

             this.toggleProperty(dcard);



        },

        closeDesktop: function (dcard) {
            this.toggleProperty(dcard);
            this.toggleProperty('mCard');

        }
    }

});
