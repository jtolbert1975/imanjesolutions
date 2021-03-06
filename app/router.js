import Ember from 'ember';
import config from './config/environment';


const router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

router.map(function() {
  this.route('home');
  this.route('about');
  this.route('services');
  this.route('contact', function() {});
  this.route('login');
  this.route('admin');
  this.route('contacts', function() {
    this.route('inquiries');
  });
  this.route('thankyou');
  this.route('folio');
});



export default router;
