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

  var from = new AnyLocation();
  var to = new AnyLocation();
  var costs = [];

  /**
   * Builds a new jump instance, based on the current configured members.
   *
   * @return {everoute.travel.Jump} the built jump instance
   */
  this.build = function() {
    return new Jump(jumpType, from, destinationId, to, costs);
  };

  /**
   * The location in the source solar system where this jump is started.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the source location
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.from = function(location) {
    from = location;

    return this;
  };

  /**
   * The location in the destination solar system where this jump is landing.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the destination location
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.to = function(location) {
    to = location;

    return this;
  };

  /**
   * Adds another cost involved in this jump.
   *
   * @param  {everoute.travel.TravelCost} cost the extra cost
   * @return {everoute.travel.JumpBuilder} this instance
   */
  this.addCost = function(cost) {
    costs.push(cost);

    return this;
  };
}

module.exports = JumpBuilder;
