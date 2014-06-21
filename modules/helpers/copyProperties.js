function copyProperties(object, propertyNames) {
  var copy = {};

  propertyNames.forEach(function (property) {
    if (object.hasOwnProperty(property))
      copy[property] = object[property];
  });

  return copy;
}

module.exports = copyProperties;
