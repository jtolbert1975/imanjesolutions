import DS from 'ember-data';

var Quotes = DS.Model.extend({
    name: DS.attr('string'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
    about: DS.attr('string'),
    budget: DS.attr('string'),
    web_address: DS.attr('string'),
    pages: DS.attr('string'),
    description: DS.attr('string'),
    features: DS.attr('string'),
    example1: DS.attr('string'),
    example2: DS.attr('string'),
    example3: DS.attr('string'),




});

/*Quotes.reopenClass({
    FIXTURES: [
    {
        id: 0,
        name: 'Jesse James',
        email: 'jjtheman@gmail.com',
        phone: '6102787893'

    },

    {
        id: 1,
        name: 'Ashley Nixon',
        email: 'ashleylips@gmail.com',
        phone: '4047862235'

    },

    {
        id: 2,
        name: 'Tasha Pearlman',
        email: 'tgoodpuccie@gmail.com',
        phone: '4042078869'

    }
]
});*/

export default Quotes;