import Ember from 'ember';

export default Ember.Component.extend({

   isContact:'',
    isQuote:'',

    init(){
        this._super(...arguments);
        this.set('isContact', true);
        this.set('isQuote', false);


    },

    actions:{
        showTab(tabName){

            let tabname = tabName;

            //Check to see if selected tab equals the current tab
            if(tabname === 'quotes'){
                let isCurrent = this.get('isQuote');
                if(isCurrent === true){
                    return false;
                } else {
                    this.toggleProperty('isContact');
                    this.toggleProperty('isQuote');
                }
            } else { //Checks to make sure the current Tab is not Contacts
                let isCurrent = this.get('isContact');
                if(isCurrent === true){
                    return false;
                } else {
                    this.toggleProperty('isContact');
                    this.toggleProperty('isQuote');
                }
            }


        }
    }



});
