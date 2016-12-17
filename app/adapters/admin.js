import ApplicationAdapter from './application';

export default DS.JSONAPIAdapter.extend({
    namespace: 'api/',
    host: 'http://localhost:8888',
    defaultSerializer: '-default'
});
