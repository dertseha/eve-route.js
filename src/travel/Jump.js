"use strict";

/**
 * This class represents a jump across the universe.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {String} ofType jump type specification
 * @param {everoute.travel.Location} fromLocation Source location
 * @param {Number} toSystemId Identifying the destination solar system
 * @param {everoute.travel.Location} toLocation location within destination system
 * @param {Array.<everoute.travel.TravelCost>} costs Array of costs involved with this jump
 */
function Jump(ofType, fromLocation, toSystemId, toLocation, costs) {

  var jumpCosts = costs.slice(0);

  /**
   * @return {String} Type identifying how the jump is performed.
   */
  this.getType = function() {
    return ofType;
  };

  /**
   * @return {Number} Identifying the destination solar system.
   */
  this.getDestinationId = function() {
    return toSystemId;
  };

  /**
   * @param {everoute.travel.Location} Location within the source system.
   */
  this.getSourceLocation = function() {
    return fromLocation;
  };

  /**
   * @param {everoute.travel.Location} toLocation location within destination system.
   */
  this.getDestinationLocation = function() {
    return toLocation;
  };

  /**
   * @param {Array.<everoute.travel.TravelCost>} Array of costs involved with this jump
   */
  this.getCosts = function() {
    return jumpCosts.slice(0);
  };
}

module.exports = Jump;
