import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('admin-content', 'Integration | Component | admin content', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  let stubContact = Ember.Object.create({
    id: 1,
    f_name: 'Mary',
    l_name: 'Livemoore',
    email: 'mlivemore@textmail.com',
    phone: '4042356629',
    skype: 'ml55t',
    contactMethd: 'email',
    request: 'Can you make mobile sites'

  });

this.set('contactObj', stubContact);
  this.render(hbs`{{admin-content contact=contactObj}}`);

  assert.equal(this.$('').text().trim(), '');
  assert.equal(this.$('.table-cell').text().trim(), 'email');


  // Template block usage:
  this.render(hbs`
    {{#admin-content}}
      template block text
    {{/admin-content}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
