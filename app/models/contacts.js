import DS from 'ember-data';

 var contacts = DS.Model.extend({
     id: DS.attr('number'),
    f_name: DS.attr('string'),
    l_name: DS.attr('string'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
    skype: DS.attr('string'),
    contactMethd: DS.attr('string'),
    request: DS.attr('string')
});


/*Contacts.reopenClass({
    FIXTURES: [
        {
            id: 0,
            name: 'Jesse James',
            email: 'jjtheman@gmail.com',
            phone: '6102787893',
            contactMethd: 'email',
            request: 'I want to know, how long it will take to build an e-commerce site'
        },

        {
            id: 1,
            name: 'Ashley Nixon',
            email: 'ashleylips@gmail.com',
            phone: '4047862235',
            contactMethd: 'email',
            request: 'I want to know, how long it will take to build an e-commerce site'
        },

        {
            id: 2,
            name: 'Tasha Pearlman',
            email: 'tgoodpuccie@gmail.com',
            phone: '4042078869',
            contactMethd: 'phone',
            request: 'I want to know, how long it will take to build a blog'
        }
    ]

}) ;*/

export default contacts;
