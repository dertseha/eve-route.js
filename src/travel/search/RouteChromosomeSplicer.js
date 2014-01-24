"use strict";

/**
 * A splicer to create new route chromosomes.
 *
 * @param {everoute.util.Randomizer} rand A randomizer for creating new things.
 * @memberof everoute.travel.search
 */
function RouteChromosomeSplicer(rand) {
  this.rand = rand;
}

/**
 * Creates a random route chromosome.
 *
 * @param {Array.<Number>} startIds Available IDs for the start system.
 * @param {Number} waypointCount Amount of waypoints to consider.
 * @return {{}} An initial chromosome with random start and waypoints.
 */
RouteChromosomeSplicer.prototype.createRandom = function(startIds, waypointCount) {
  var result = {
    startSystemId: startIds[this.rand.getIndex(startIds.length)],
    waypoints: [],
    destination: null
  };
  var waypoint;
  var i;

  for (i = 0; i < waypointCount; i++) {
    result.waypoints.push({
      index: this.findUnusedWaypointIndex(result.waypoints, waypointCount),
      path: null
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
 */
RouteChromosomeSplicer.prototype.createOffspring = function(parent1, parent2, crossoverIndex) {
  var result = {
    startSystemId: parent1.startSystemId,
    waypoints: [],
    destination: parent2.destination
  };
  var temp;
  var index = 0;

  while ((index < crossoverIndex) && (index < parent1.waypoints.length)) {
    temp = parent1.waypoints[index];
    result.waypoints.push(temp);
    index++;
  }
  while (index < parent2.waypoints.length) {
    temp = parent2.waypoints[index];
    if (this.isWaypointIndexUsed(result.waypoints, temp.index)) {
      result.waypoints.push({
        index: this.findUnusedWaypointIndex(result.waypoints, parent2.waypoints.length),
        path: null
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
 */
RouteChromosomeSplicer.prototype.isWaypointIndexUsed = function(waypoints, index) {
  var result = false;

  function check(entry) {
    if (entry.index === index) {
      result = true;
    }
  }

  waypoints.forEach(check);

  return result;
};

module.exports = RouteChromosomeSplicer;
