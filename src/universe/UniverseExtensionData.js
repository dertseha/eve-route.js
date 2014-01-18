"use strict";

/**
 * The extension data is used as a initialization data for an
 * ExtendedUniverse.
 *
 * @constructor
 * @private
 * @param {everoute.universe.Universe} base the base universe.
 * @memberof everoute.universe
 */
function UniverseExtensionData(base) {
  /**
   * @type {everoute.universe.Universe}
   */
  this.base = base;

  /**
   * @type {Array.<everoute.universe.SolarSystem>}
   */
  this.solarSystems = [];
}

module.exports = UniverseExtensionData;
