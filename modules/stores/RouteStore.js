var React = require('react');
var invariant = require('react/lib/invariant');
var Path = require('../helpers/Path');

var _namedRoutes = {};

var RouteStore = {

  registerRoute: function (route, _parentRoute) {
    // invariant(
    //   React.isValidComponent(route) && route.type === Route.type,
    //   'Routes may only contain <Route> components'
    // );

    // Make sure the <Route>'s path begins with a slash. Default to its name.
    if (route.props.path || route.props.name) {
      route.props.path = Path.normalize(route.props.path || route.props.name);
    } else {
      route.props.path = '/';
    }

    // Make sure the <Route> has a valid React component for a handler.
    invariant(
      React.isValidComponent(route.props.handler),
      'The handler for Route "' + (route.props.name || route.props.path) + '" ' +
      'must be a valid React component'
    );

    // Make sure the <Route> has all params of its parent.
    if (_parentRoute) {
      var paramNames = Path.extractParamNames(route.props.path);

      Path.extractParamNames(_parentRoute.props.path).forEach(function (paramName) {
        invariant(
          paramNames.indexOf(paramName) !== -1,
          'The nested route path "' + route.props.path + '" is missing the "' + paramName + '" ' +
          'parameter of its parent path "' + _parentRoute.props.path + '"'
        );
      });
    }

    // Make sure the <Route> can be looked up by <Link>s.
    if (route.props.name) {
      invariant(
        !_namedRoutes[route.props.name],
        'You cannot use the name "' + route.props.name + '" for more than one route'
      );

      _namedRoutes[route.props.name] = route;
    }

    React.Children.forEach(route.props.children, function (child) {
      RouteStore.registerRoute(child, route);
    });
  },

  /**
   * Returns the Route object with the given name, if one exists.
   */
  getRouteByName: function (routeName) {
    return _namedRoutes[routeName];
  },

  /**
   * Removes references to all named Routes. Useful in tests.
   */
  clearNamedRoutes: function () {
    _namedRoutes = {};
  }

};

module.exports = RouteStore;
