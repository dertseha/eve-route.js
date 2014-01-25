"use strict";

/**
 * A final route.
 *
 * @constructor
 * @param {everoute.travel.Path} startPath The originating path.
 * @param {Array.<{}>} waypoints The waypoints (originating index and path)
 * @param {everoute.travel.Path} [destinationPath] The destination path.
 * @memberof everoute.travel.search
 */
function Route(startPath, waypoints, destinationPath) {
  var costSum = startPath.getCostSum();

  waypoints.forEach(function(entry) {
    costSum = costSum.add(entry.path.getCostSum().getTotal());
  });
  if (destinationPath) {
    costSum = costSum.add(destinationPath.getCostSum().getTotal());
  }

  this.getChromosome = function() {
    var result = {};

    return result;
  };

  /**
   * @return {everoute.travel.TravelCostSum} The total cost of this route
   */
  this.getCostSum = function() {
    return costSum;
  };

  /**
   * @return {String} A string presentation
   */
  this.toString = function() {
    var result = "[" + startPath.getDestinationKey() + "]";

    waypoints.forEach(function(entry) {
      result += "-" + entry.index + "[" + entry.path.getDestinationKey() + "]";
    });
    if (destinationPath) {
      result += "-[" + destinationPath.getDestinationKey() + "]";
    }

    return result;
  };
}


module.exports = Route;
