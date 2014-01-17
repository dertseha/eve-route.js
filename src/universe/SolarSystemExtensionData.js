"use strict";

/**
 * The extension data is used as a initialization data for an
 * ExtendedSolarSystem.
 *
 * @constructor
 * @param {everoute.universe.SolarSystem} baseSystem the base solar system.
 * @memberof everoute.universe
 */
function SolarSystemExtensionData(baseSystem) {
  /**
   * @type {everoute.universe.SolarSystem}
   */
  this.base = baseSystem;

  /**
   * @type {Array.<everoute.universe.JumpBuilder>}
   */
  this.jumpBuilders = [];

  /**
   * @type {Array.<everoute.travel.TravelCost>}
   */
  this.costs = [];
}

module.exports = SolarSystemExtensionData;
