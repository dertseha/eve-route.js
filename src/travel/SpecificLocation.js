"use strict";

/**
 * This location has a specific position in space. It can provide results
 * when compared to other specific locations.
 *
 * @constructor
 * @implements everoute.travel.Location
 * @extends everoute.travel.Location
 * @param {Number} x The X coordinate.
 * @param {Number} y The Y coordinate.
 * @param {Number} z The Z coordinate.
 * @memberof everoute.travel
 */
function SpecificLocation(x, y, z) {
  var position = [x, y, z];

  this.toString = function() {
    return "[" + x + ", " + y + ", " + z + "]";
  };

  this.getPositionRelativeTo = function(origin) {
    return [position[0] - origin[0], position[1] - origin[1], position[2] - origin[2]];
  };

  this.distanceTo = function(other) {
    var pos = other.getPositionRelativeTo(position.slice(0));

    return Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2]);
  };
}

module.exports = SpecificLocation;
