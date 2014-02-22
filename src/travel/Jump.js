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

  this.ofType = ofType;
  this.fromLocation = fromLocation;
  this.toSystemId = toSystemId;
  this.toLocation = toLocation;
  this.jumpCosts = costs.slice(0);
}

/**
 * @return {String} Type identifying how the jump is performed.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getType = function() {
  return this.ofType;
};

/**
 * @return {Number} Identifying the destination solar system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getDestinationId = function() {
  return this.toSystemId;
};

/**
 * @param {everoute.travel.Location} Location within the source system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getSourceLocation = function() {
  return this.fromLocation;
};

/**
 * @param {everoute.travel.Location} toLocation location within destination system.
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getDestinationLocation = function() {
  return this.toLocation;
};

/**
 * @param {Array.<everoute.travel.TravelCost>} Array of costs involved with this jump
 * @memberof! everoute.travel.Jump.prototype
 */
Jump.prototype.getCosts = function() {
  return this.jumpCosts.slice(0);
};

module.exports = Jump;
