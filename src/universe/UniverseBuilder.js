"use strict";

var EmptySolarSystem = require("./EmptySolarSystem");
var ExtendedSolarSystem = require("./ExtendedSolarSystem");
var ExtendedUniverse = require("./ExtendedUniverse");
var UniverseExtensionData = require("./UniverseExtensionData");
var SolarSystemExtension = require("./SolarSystemExtension");
var SolarSystemExtensionData = require("./SolarSystemExtensionData");

/**
 * A builder that is used to create (or extend) a universe.
 *
 * @constructor
 * @param {everoute.universe.Universe} base the base universe that should be extended.
 * @memberof everoute.universe
 */
function UniverseBuilder(base) {

  var extensionData = new UniverseExtensionData(base);

  var solarSystemExtensionData = {};

  /**
   * Builds the universe as per current data. The returned instance is a read-only
   * universe that was created according to the settings from the builder.
   *
   * @return {everoute.universe.Universe}
   */
  this.build = function() {
    var key;

    for (key in solarSystemExtensionData) {
      extensionData.solarSystems.push(new ExtendedSolarSystem(solarSystemExtensionData[key]));
    }

    return new ExtendedUniverse(extensionData);
  };

  /**
   * Adds a new solar system to the universe. The given ID must be unique and
   * not refer to an already existing solar system.
   *
   * @param {Number} id The unique key for the new solar system.
   * @param {{galaxyId: Number, regionId: Number, constellationId: Number}} contextIds ID values of container.
   * @param {everoute.travel.Location} location The location this solar system is at in the universe.
   * @param {Number} trueSecurity The true security value [-1.0 .. 1.0]
   * @throws {Error} When the solar system already exists.
   */
  this.addSolarSystem = function(id, contextIds, location, trueSecurity) {
    if (!solarSystemExtensionData.hasOwnProperty(id) && !base.hasSolarSystem(id)) {
      var baseSystem = new EmptySolarSystem(id, contextIds, location, trueSecurity);
      var data = new SolarSystemExtensionData(baseSystem);

      solarSystemExtensionData[id] = data;
    } else {
      throw new Error("Solar System " + id + " already exists.");
    }
  };

  /**
   * Requests to extend an existing solar system.
   *
   * @param  {Number} id The unique key of the solar system.
   * @return {everoute.universe.SolarSystemExtension} the extension via which to add new things.
   * @throws {Error} When the solar system doesn't exist.
   */
  this.extendSolarSystem = function(id) {
    var result;
    var data = solarSystemExtensionData[id];

    if (!data && base.hasSolarSystem(id)) {
      data = new SolarSystemExtensionData(base.getSolarSystem(id));
      solarSystemExtensionData[id] = data;
    }

    if (data) {
      result = new SolarSystemExtension(solarSystemExtensionData[id]);
    } else {
      throw new Error("Solar System " + id + " doesn't exist.");
    }

    return result;
  };
}

module.exports = UniverseBuilder;
