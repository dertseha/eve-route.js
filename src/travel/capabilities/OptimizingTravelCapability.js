"use strict";

/**
 * This capability puts the result of another capability into a contest and
 * provides only the best for each destination.
 *
 * @constructor
 * @implements everoute.travel.capabilities.TravelCapability
 * @extends everoute.travel.capabilities.TravelCapability
 * @param {everoute.travel.capabilities.TravelCapability} capability The base capability.
 * @param {everoute.travel.PathContestProvider} contestProvider provider for the contests.
 * @memberof everoute.travel.capabilities
 */
function OptimizingTravelCapability(capability, contestProvider) {

  this.getNextPaths = function(origin) {
    var contest = contestProvider.getContest();
    var result = [];
    var best = {};
    var temp;

    if (contest.enter(origin)) {
      temp = capability.getNextPaths(origin);
      temp.forEach(function(path) {
        var destinationKey = path.getDestinationKey();

        if ((origin.isStart() || (origin.getPrevious().getDestinationKey() !== destinationKey)) && contest.enter(path)) {
          best[destinationKey] = path;
        }
      });
    }
    for (temp in best) {
      if (best.hasOwnProperty(temp)) {
        result.push(best[temp]);
      }
    }

    return result;
  };
}

module.exports = OptimizingTravelCapability;
