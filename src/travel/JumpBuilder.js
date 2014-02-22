"use strict";

var AnyLocation = require("./AnyLocation");
var Jump = require("./Jump");

/**
 * This builder is for creating a jump description.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {String} jumpType Type of jump
 * @param {Number} destinationId ID of the destination solar system
 */
function JumpBuilder(jumpType, destinationId) {
  this.jumpType = jumpType;
  this.destinationId = destinationId;
  this.fromLocation = AnyLocation.INSTANCE;
  this.toLocation = AnyLocation.INSTANCE;
  this.costs = [];
}

/**
 * Builds a new jump instance, based on the current configured members.
 *
 * @return {everoute.travel.Jump} the built jump instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.build = function() {
  return new Jump(this.jumpType, this.fromLocation, this.destinationId, this.toLocation, this.costs);
};

/**
 * The location in the source solar system where this jump is started.
 * Defaults to AnyLocation.
 *
 * @param  {everoute.travel.Location} location the source location
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.from = function(location) {
  this.fromLocation = location;

  return this;
};

/**
 * The location in the destination solar system where this jump is landing.
 * Defaults to AnyLocation.
 *
 * @param  {everoute.travel.Location} location the destination location
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.to = function(location) {
  this.toLocation = location;

  return this;
};

/**
 * Adds another cost involved in this jump.
 *
 * @param  {everoute.travel.TravelCost} cost the extra cost
 * @return {everoute.travel.JumpBuilder} this instance
 * @memberof! everoute.travel.JumpBuilder.prototype
 */
JumpBuilder.prototype.addCost = function(cost) {
  this.costs.push(cost);

  return this;
};


module.exports = JumpBuilder;
