"use strict";

var StepBuilder = require("../travel/StepBuilder");

/**
 * An extended solar system that is based on another, but has its own extensions.
 * Queries that can not be handled within this system will be delegated to
 * the base.
 *
 * @constructor
 * @implements everoute.universe.SolarSystem
 * @extends {everoute.universe.SolarSystem}
 * @param {everoute.universe.SolarSystemExtensionData} data the data this extension is based on.
 * @memberof everoute.universe
 */
function ExtendedSolarSystem(data) {

  /**
   * @type {everoute.universe.SolarSystem}
   * @private
   */
  var base = data.base;

  /**
   * @type {Object.<String,Array.<everoute.travel.Jump>>}
   * @private
   */
  var jumps = {};

  /**
   * @type {Array.<everoute.travel.TravelCost>}
   * @private
   */
  var costs = data.costs.slice(0);

  data.jumpBuilders.forEach(function(builder) {
    var jump = builder.build();
    var jumpType = jump.getType();
    var list = jumps[jumpType] || [];

    jumps[jumpType] = list.concat([jump]);
  });

  this.getId = function() {
    return base.getId();
  };

  this.getGalaxyId = function() {
    return base.getGalaxyId();
  };

  this.getRegionId = function() {
    return base.getRegionId();
  };

  this.getConstellationId = function() {
    return base.getConstellationId();
  };

  this.getLocation = function() {
    return base.getLocation();
  };

  this.getSecurityValue = function() {
    return base.getSecurityValue();
  };

  this.getJumps = function(jumpType) {
    var result = base.getJumps(jumpType);

    if (jumps.hasOwnProperty(jumpType)) {
      result = result.concat(jumps[jumpType]);
    }

    return result;
  };

  this.getCosts = function() {
    var result = base.getCosts();

    return result.concat(costs);
  };

  this.startPath = function() {
    return base.startPath();
  };
}

module.exports = ExtendedSolarSystem;
