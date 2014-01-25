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
