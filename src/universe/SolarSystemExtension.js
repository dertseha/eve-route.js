"use strict";

var JumpBuilder = require("../travel/JumpBuilder");

/**
 * An extension helper for solar systems.
 *
 * @class
 * @constructor
 * @param {everoute.universe.SolarSystemExtensionData} data the extension data.
 * @memberof everoute.universe
 */
function SolarSystemExtension(data) {

  /**
   * @return {Number} The unique ID for the solar system.
   */
  this.getId = function() {
    return data.base.getId();
  };

  /**
   * @return {Number} The galaxy ID of the solar system
   */
  this.getGalaxyId = function() {
    return data.base.getGalaxyId();
  };

  /**
   * @return {everoute.travel.Location} The location of the solar system in the universe.
   */
  this.getLocation = function() {
    return data.base.getLocation();
  };

  /**
   * @return {Number} The security value of the solar system.
   */
  this.getSecurityValue = function() {
    return data.base.getSecurityValue();
  };

  /**
   * Requests to add a jump from this solar system to another. The returned
   * builder can be used to refine the jump properties.
   *
   * @param {String} jumpType Type of jump
   * @param {Number} destinationId ID of the destination solar system
   * @return {everoute.travel.JumpBuilder} a builder instance for details
   */
  this.addJump = function(jumpType, destinationId) {
    var builder = new JumpBuilder(jumpType, destinationId);

    data.jumpBuilders.push(builder);

    return builder;
  };

  /**
   * Adds a cost to the solar system.
   * @param {everoute.travel.TravelCost} cost The extra cost to add.
   */
  this.addCost = function(cost) {
    data.costs.push(cost);
  };
}

module.exports = SolarSystemExtension;
