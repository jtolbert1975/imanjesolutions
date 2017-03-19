import Ember from 'ember';

export default Ember.Component.extend({
    isWebdesign: '',
    showWebdesign: '',
    isWebApp: '',
    showWebApp: '',
    isSocial: '',
    showSocial: '',
    isBranding: '',
    showBranding:'',


    didInsertElement(){
        this.set('isWebdesign', true);
        this.set('showWebdesign', false);

        this.set('isWebApp', true);
        this.set('showWebApp', false);

        this.set('isSocial', true);
        this.set('showSocial', false);

        this.set('isBranding', true);
        this.set('showBranding', false);


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
