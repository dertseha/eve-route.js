"use strict";

/**
 * This interface represents the read-only access to a created universe. If
 * the universe is to be extended, call the extend() method to get a new
 * builder that is based on this universe.
 *
 * @class
 * @interface
 * @memberof everoute.universe
 */
function Universe() {

}

/**
 * Starts an extension of this universe. It returns an instance of a
 * UniverseBuilder. The builder can be used to create a new universe, which
 * is based on this one. What has not been modified in the new universe will
 * refer to the members of this universe.
 *
 * @return {everoute.universe.UniverseBuilder} the builder for a new universe.
 * @memberof! everoute.universe.Universe.prototype
 */
Universe.prototype.extend = function() {
  throw new Error("Interface Implementation");
};

/**
 * @param  {Number} id The key of the solar system to check.
 * @return {Boolean} True if getSolarSystem() will return an instance for given ID.
 * @memberof! everoute.universe.Universe.prototype
 */
Universe.prototype.hasSolarSystem = function(id) {
  throw new Error("Interface Implementation");
};

/**
 * This method returns a SolarSystem instance for the given key.
 *
 * @param  {Number} id The identifier of the solar system.
 * @return {everoute.universe.SolarSystem} The solar system that has given ID.
 * @throws {Error} If the system can not be found.
 * @memberof! everoute.universe.Universe.prototype
 */
Universe.prototype.getSolarSystem = function(id) {
  throw new Error("Interface Implementation");
};

/**
 * @return {Array.<Number>} Array of IDs from all known solar systems
 */
Universe.prototype.getSolarSystemIds = function() {
  throw new Error("Interface Implementation");
};
