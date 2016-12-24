import Ember from 'ember';

export default Ember.Component.extend({

 isShown: 'false',
 isSubmitted: 'false',
 notSubmit: '',
 isValidName: '',
    nameErr: function () {
        var name = this.get('name');
        if(Ember.isEmpty(name) || Ember.isBlank(name)){
            this.set('isValidName', false);
            return "required";
        }

        if(name.length < 5) {
            this.set('isValidName', false);
            return "minimum is 5 characters";
        }

        this.set('Name',true);

    }.property('name'),

    disabled: function(){
        var isValidName = this.get('isValidName');

        if(isValidName){
            return false;
        } else {
            return true;
        }
    },



    init(){
        this._super(...arguments);
        this.set('isShown', false);
        this.set('isSubmitted', false);
        this.set('notSubmit', true);
        this.set('isValidName', true);

    },

    didInsertElement(){
      var contactInfo = this.get('data');
        contactInfo.map(item=> {
            console.log(item.get('name'));
        });
    },



    actions: {

        /*showClick: function (element) {
            this.toggleProperty('isShown');
        },*/
       openModal: function() {

           this.toggleProperty('isShown');
            //var modal = this.get('comp-' + target);
            //modal.send('toggleModal');
        },
         submitForm: function() {

            this.toggleProperty('isShown');
             this.toggleProperty('isSubmitted');
             this.toggleProperty('notSubmit');
        }
    }
});
