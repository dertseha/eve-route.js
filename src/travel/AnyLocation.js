"use strict";

/**
 * This location is 'any' location. Compared to others, it will always refer
 * to the other location.
 *
 * @constructor
 * @implements everoute.travel.Location
 * @extends everoute.travel.Location
 * @memberof everoute.travel
 */
function AnyLocation() {

}

AnyLocation.prototype.toString = function() {
  return "*";
};

AnyLocation.prototype.getPositionRelativeTo = function(origin) {
  return [0, 0, 0];
};

AnyLocation.prototype.distanceTo = function(other) {
  return 0;
};

module.exports = AnyLocation;
