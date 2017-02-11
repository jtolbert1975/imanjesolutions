import Ember from 'ember';

export default Ember.Component.extend({
 store: Ember.inject.service(),
 isShown: '',
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
    /*  var contactInfo = this.get('data');
        contactInfo.map(item=> {
            console.log(item.get('name'));
        });*/
    },



    actions: {

        /*showClick: function (element) {
            this.toggleProperty('isShown');
        },*/
     /*  openModal: function() {
           console.log("You Tried to Open the Form");

           this.toggleProperty('isShown');

        },*/
        showForm: function(){


            this.toggleProperty('isShown');
        },

       //  submitForm: function() {
             //console.log("You Called submit Form");
            // this.send('createContact', this);


            //this.toggleProperty('isShown');
            // this.toggleProperty('isSubmitted');
            // this.toggleProperty('notSubmit');
             //return true;
        //},
        createContact: function(){
            console.log("You are Now creating a contact");
           let contactMethd = this.get('selectedContctMethd');
            console.log("Contact Method: " + contactMethd);
            var store = this.get('store');
            var newContact = store.createRecord('contacts', {
                f_name: this.get('fname'),
                l_name: this.get('lname'),
                email: this.get('email'),
                phone: this.get('phone'),
                skype: this.get('skype'),
                contactMethd: this.get('selectedContctMethd'),
                request: this.get('request'),

            });

           newContact.save();
            this.get('router').transitionTo('thankyou');

            //return true;
        }


    }
});
