"use strict";

var StepBuilder = require("../../StepBuilder");

/**
 * This capability uses jump gates to get out of a system
 *
 * @constructor
 * @implements {everoute.travel.capabilities.TravelCapability}
 * @extends {everoute.travel.capabilities.TravelCapability}
 * @param {everoute.universe.Universe} universe the universe to query
 * @memberof everoute.travel.capabilities.jumpGate
 */
function JumpGateTravelCapability(universe) {

  this.getNextPaths = function(path) {
    var solarSystem = universe.getSolarSystem(path.getStep().getSolarSystemId());
    var jumps = solarSystem.getJumps(JumpGateTravelCapability.JUMP_TYPE);
    var result = [];

    jumps.forEach(function(jump) {
      var destination = universe.getSolarSystem(jump.getDestinationId());
      var builder = new StepBuilder(destination.getId()).withEnterCosts(jump.getCosts()).withContinueCosts(destination.getCosts());

      result.push(path.extend(builder.build()));
    });

    return result;
  };
}

JumpGateTravelCapability.JUMP_TYPE = "jumpGate";

module.exports = JumpGateTravelCapability;
