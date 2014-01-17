"use strict";

var UniverseBuilder = require("./UniverseBuilder");

/**
 * This is the simplest Universe implementation that is completely empty.
 * It can be used as a basis for extension - i.e., creating a filled universe.
 *
 * @constructor
 * @implements {everoute.universe.Universe}
 * @extends {everoute.universe.Universe}
 * @memberof everoute.universe
 */
function EmptyUniverse() {

}

EmptyUniverse.prototype.extend = function() {
  return new UniverseBuilder(this);
};

EmptyUniverse.prototype.hasSolarSystem = function(id) {
  return false;
};

EmptyUniverse.prototype.getSolarSystem = function(id) {
  throw new Error("SolarSystem with ID <" + id + "> not found");
};

EmptyUniverse.prototype.getSolarSystemIds = function() {
  return [];
};

module.exports = EmptyUniverse;
