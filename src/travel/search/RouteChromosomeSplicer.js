"use strict";

/**
 * A splicer to create new route chromosomes.
 *
 * @constructor
 * @private
 * @param {everoute.util.Randomizer} rand A randomizer for creating new things.
 * @memberof everoute.travel.search
 */
function RouteChromosomeSplicer(rand) {
  this.rand = rand;
}

/**
 * Creates a random route chromosome.
 *
 * @param {Array.<everoute.travel.Path>} startPaths Available paths for the start system.
 * @param {Number} waypointCount Amount of waypoints to consider.
 * @return {{}} An initial chromosome with random start and waypoints.
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.createRandom = function(startPaths, waypointCount) {
  var result = {
    startPath: startPaths[this.rand.getIndex(startPaths.length)],
    waypoints: [],
    destinationKey: null
  };
  var waypoint;
  var i;

  for (i = 0; i < waypointCount; i++) {
    result.waypoints.push({
      index: this.findUnusedWaypointIndex(result.waypoints, waypointCount),
      destinationKey: null
    });
  }

  return result;
};

/**
 * Creates an offspring from given parents. The start is taken from parent1, the
 * destination from parent2. waypoints up to crossoverIndex are taken from
 * parent1, the rest from parent2.
 * If parent2's waypoints are already included in the previous list of
 * waypoints, a random index is searched.
 *
 * @param {{}} parent1 first parent chromosome
 * @param {{}} parent2 second parent chromosome
 * @param {Number} crossoverIndex [description]
 * @return {{}} a created chromosome offspring
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.createOffspring = function(parent1, parent2, crossoverIndex) {
  var result = {
    startPath: parent1.startPath,
    waypoints: [],
    destinationKey: parent2.destinationKey
  };
  var temp;
  var index = 0;

  while (index < crossoverIndex) {
    temp = parent1.waypoints[index];
    result.waypoints.push(temp);
    index++;
  }
  while (index < parent2.waypoints.length) {
    temp = parent2.waypoints[index];
    if (this.isWaypointIndexUsed(result.waypoints, temp.index)) {
      result.waypoints.push({
        index: this.findUnusedWaypointIndex(result.waypoints, parent2.waypoints.length),
        destinationKey: null
      });
    } else {
      result.waypoints.push(temp);
    }
    index++;
  }

  return result;
};

/**
 * Finds an index that hasn't been used in the list of given waypoints.
 *
 * @param {{index:Number}} waypoints existing waypoints
 * @param {Number} limit upper limit for index
 * @return {Number} An available index
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.findUnusedWaypointIndex = function(waypoints, limit) {
  var result = this.rand.getIndex(limit);
  var isUnique;

  while (this.isWaypointIndexUsed(waypoints, result)) {
    result = this.rand.getIndex(limit);
  }

  return result;
};

/**
 * Checks whether a waypoint index is used already in a list of waypoints.
 *
 * @param {Array.<{}>} waypoints The waypoints to check.
 * @param {Number} index The index to check.
 * @return {Boolean} True if the given index has already been used.
 * @memberof! everoute.travel.search.RouteChromosomeSplicer.prototype
 */
RouteChromosomeSplicer.prototype.isWaypointIndexUsed = function(waypoints, index) {
  var result = false;
  var amount = waypoints.length;
  var i;

  for (i = 0; !result && (i < amount); i++) {
    if (waypoints[i].index === index) {
      result = true;
    }
  }

  return result;
};

module.exports = RouteChromosomeSplicer;
