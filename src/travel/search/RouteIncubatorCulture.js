"use strict";

var Route = require("./Route");

/**
 * A route culture, which is grown into a complete route.
 *
 * @constructor
 * @private
 * @param {{}} chromosome The chromosome describing the culture.
 * @memberof everoute.travel.search
 */
function RouteIncubatorCulture(chromosome) {
  this.chromosome = chromosome;
  this.waypoints = [];
  this.destinationPath = null;
}

/**
 * @return {{}} The chromosome of this culture
 *
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.getChromosome = function() {
  return this.chromosome;
};

/**
 * @return {everoute.travel.Path} The currently last known path of the route.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.getLastPath = function() {
  var result = this.chromosome.startPath;
  var waypoints = this.waypoints.length;

  if (waypoints > 0) {
    result = this.waypoints[waypoints - 1].path;
  }

  return this.destinationPath || result;
};

/**
 * @return {Number} Amount of waypoints currently known
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.getWaypointAmount = function() {
  return this.waypoints.length;
};

/**
 * Adds given path as a waypoint
 * @param {Number} index The index of the originating waypoint.
 * @param {everoute.travel.Path} path the found path.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.addWaypointPath = function(index, path) {
  var entry = {
    index: index,
    path: path
  };

  this.waypoints.push(entry);
};

/**
 * @param {everoute.travel.Path} path The destination path.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.setDestinationPath = function(path) {
  this.destinationPath = path;
};

/**
 * @return {everoute.travel.Route} The final route instance.
 * @memberof! everoute.travel.search.RouteIncubatorCulture.prototype
 */
RouteIncubatorCulture.prototype.toRoute = function() {
  return new Route(this.chromosome.startPath, this.waypoints, this.destinationPath);
};

module.exports = RouteIncubatorCulture;
