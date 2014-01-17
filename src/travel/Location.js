"use strict";

/**
 * This interface represents a location in space.
 *
 * @class
 * @interface
 * @memberof everoute.travel
 */
function Location() {

}

/**
 * Returns the vector for this location, relative to given origin.
 *
 * @param  {Array.<Number>} origin The origin vector to relate to.
 * @return {Array.<Number>} The relative vector. Origin + result = this location.
 * @memberof! everoute.travel.Location.prototype
 */
Location.prototype.getPositionRelativeTo = function(origin) {
  throw new Error("Interface Implementation");
};

/**
 * Calculates the distance to the given other location.
 *
 * @param  {everoute.travel.Location} other The other location to measure against.
 * @return {Number} The vector distance between this and the other location.
 * @memberof! everoute.travel.Location.prototype
 */
Location.prototype.distanceTo = function(other) {
  throw new Error("Interface Implementation");
};
