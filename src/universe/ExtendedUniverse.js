"use strict";

/**
 * An extended universe that is based on another, but has its own extensions.
 * Queries that can not be handled within this universe will be delegated to
 * the base universe.
 *
 * @constructor
 * @implements everoute.universe.Universe
 * @extends {everoute.universe.Universe}
 * @param {everoute.universe.UniverseExtensionData} data the data this extension is based on.
 * @memberof everoute.universe
 */
function ExtendedUniverse(data) {

  /**
   * @type {everoute.universe.Universe}
   * @private
   */
  var base = data.base;

  /**
   * @type {Object.<Number, everoute.universe.SolarSystem>}
   * @private
   */
  var solarSystems = {};

  /**
   * Constructor
   * @private
   */
  function constructor() {
    data.solarSystems.forEach(function(system) {
      solarSystems[system.getId()] = system;
    });
  }

  this.hasSolarSystem = function(id) {
    var result = solarSystems.hasOwnProperty(id) || base.hasSolarSystem(id);

    return result;
  };

  this.getSolarSystem = function(id) {
    var result = solarSystems[id] || base.getSolarSystem(id);

    return result;
  };

  this.getSolarSystemIds = function() {
    var result = base.getSolarSystemIds();
    var key;
    var addId = function(id) {
      var index = result.indexOf(id);

      if (index < 0) {
        result.push(id);
      }
    };

    for (key in solarSystems) {
      addId(solarSystems[key].getId());
    }

    return result.sort();
  };

  constructor();
}

ExtendedUniverse.prototype.extend = function() {
  var UniverseBuilder = require("./UniverseBuilder");

  return new UniverseBuilder(this);
};

module.exports = ExtendedUniverse;
