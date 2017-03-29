export function initialize( application) {
  // application.inject('route', 'foo', 'service:foo');
  //application.inject('component', 'router', 'router:Main');
  application.inject('component', 'store', 'service:store');
}

export default {
  //name: 'component-router-injector',
  name: 'inject-store-into-components',
  initialize
};
