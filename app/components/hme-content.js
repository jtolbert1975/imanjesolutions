import Ember from 'ember';

export default Ember.Component.extend({
    routing: Ember.inject.service('-routing'),
    isWebdesign: '',
    showWebdesign: '',
    isWebApp: '',
    showWebApp: '',
    isSocial: '',
    showSocial: '',
    isBranding: '',
    showBranding:'',
    isIndex: '',


    didInsertElement(){
        this.set('isWebdesign', true);
        this.set('showWebdesign', false);

        this.set('isWebApp', true);
        this.set('showWebApp', false);

        this.set('isSocial', true);
        this.set('showSocial', false);

        this.set('isBranding', true);
        this.set('showBranding', false);

       //Show Back To Top button on Home view
        let daRoute = this.get('routing.currentRouteName');

        console.log("This is the Route: ", daRoute);

        if(daRoute === 'index'){
            this.set('isIndex', true);
        } else{
            console.log("Hello You are Not Index");
            this.set('isIndex', false);
        }


    },

    actions: {
        toggleSquare(){
            this.toggleProperty('isWebdesign');
            this.toggleProperty('showWebdesign');
        },

        toggleApp(){
            this.toggleProperty('isWebApp');
            this.toggleProperty('showWebApp');
        },

        toggleSocial(){
            this.toggleProperty('isSocial');
            this.toggleProperty('showSocial');
        },

        toggleBrand(){
            this.toggleProperty('isBranding');
            this.toggleProperty('showBranding');
        }
    }
});
