"use strict";

var StepBuilder = require("../../StepBuilder");
var jumpDistance = require("../../rules/jumpDistance");

/**
 * This capability uses jump drive jumps to get out of a system
 *
 * @constructor
 * @implements {everoute.travel.capabilities.TravelCapability}
 * @extends {everoute.travel.capabilities.TravelCapability}
 * @param {everoute.universe.Universe} universe the universe to query
 * @param {Number} distanceLimit amount of light years the capability can jump
 * @memberof everoute.travel.capabilities.jumpDrive
 */
function JumpDriveTravelCapability(universe, distanceLimit) {

  this.getNextPaths = function(path) {
    var solarSystem = universe.getSolarSystem(path.getStep().getSolarSystemId());
    var jumps = solarSystem.getJumps(JumpDriveTravelCapability.JUMP_TYPE);
    var result = [];

    jumps = jumps.filter(function(jump) {
      var costs = jump.getCosts();

      return costs.reduce(function(result, cost) {
        return result && ((cost.getType() !== jumpDistance.COST_TYPE) || (cost.getValue() <= distanceLimit));
      }, true);
    });
    jumps.forEach(function(jump) {
      var destination = universe.getSolarSystem(jump.getDestinationId());
      var builder = new StepBuilder(destination.getId()).withEnterCosts(jump.getCosts()).withContinueCosts(destination.getCosts());

      result.push(path.extend(builder.build()));
    });

    return result;
  };
}

JumpDriveTravelCapability.JUMP_TYPE = "jumpDrive";

module.exports = JumpDriveTravelCapability;
