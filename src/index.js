"use strict";

/**
 * This is the root namespace for everything in this library.
 *
 * @namespace everoute
 */

var universe = require("./universe");


/**
 * @return {everoute.universe.UniverseBuilder} a fresh universe builder based on an empty universe.
 * @memberof everoute
 */
var newUniverseBuilder = function() {
  return new universe.UniverseBuilder(new universe.EmptyUniverse());
};

module.exports = {
  travel: require("./travel"),
  universe: universe,
  util: require("./util"),

  newUniverseBuilder: newUniverseBuilder
};
