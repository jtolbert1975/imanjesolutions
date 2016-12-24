import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
    namespace: 'api',
    host: 'http://localhost:8888',
    defaultSerializer: '-default',
    corsWithCredentials: true
});
