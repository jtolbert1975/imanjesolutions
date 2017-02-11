export function initialize( application) {
  // application.inject('route', 'foo', 'service:foo');
  application.inject('component', 'router', 'router:Main');
}

export default {
  name: 'component-router-injector',
  initialize
};
