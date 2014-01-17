"use strict";

/**
 * This interface represents the read-only access to a solar system.
 *
 * @class
 * @interface
 * @memberof everoute.universe
 */
function SolarSystem() {

}

/**
 * @return {Number} The unique ID for this solar system.
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getId = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Number} The unique ID for the galaxy this solar system is in.
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getGalaxyId = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Number} The unique ID for the region this solar system is in.
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getRegionId = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Number} The unique ID for the constellation this solar system is in.
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getConstellationId = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {everoute.travel.Location} The location of the solar system in the universe.
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getLocation = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Number} The (rounded) security value of the solar system, [0.0 .. 1.0].
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getSecurityValue = function() {
  throw new Error("Interface Implementation");
};

/**
 * @return {Array.<everoute.travel.Jump>} Array of jumps from this system with given type.
 * @param {String} jumpType The type of jump requested
 * @memberof! everoute.universe.SolarSystem.prototype
 */
SolarSystem.prototype.getJumps = function(jumpType) {
  throw new Error("Interface Implementation");
};
