"use strict";

/**
 * This is an empty solar system. It doesn't contain anything and provides only
 * the basic information.
 *
 * @constructor
 * @implements {everoute.universe.SolarSystem}
 * @extends {everoute.universe.SolarSystem}
 * @param {Number} id The unique key for the solar system.
 * @param {{galaxyId: Number, regionId: Number, constellationId: Number}} contextIds ID values of container.
 * @param {everoute.travel.Location} location The location this solar system is at in the universe.
 * @param {Number} trueSecurity The true security value [-1.0 .. 1.0]
 * @memberof everoute.universe
 */
function EmptySolarSystem(id, contextIds, location, trueSecurity) {
  function verifyDefined(value, errorText) {
    if (typeof value === "undefined") {
      throw new Error(errorText);
    }

    return value;
  }

  /**
   * @type {Number}
   * @private
   */
  this.id = verifyDefined(id, "No id specified");

  this.galaxyId = verifyDefined(contextIds.galaxyId, "No contextIds.galaxyId specified");
  this.regionId = verifyDefined(contextIds.regionId, "No contextIds.regionId specified");
  this.constellationId = verifyDefined(contextIds.constellationId, "No contextIds.constellationId specified");

  this.location = verifyDefined(location, "No location specified");

  this.trueSecurity = verifyDefined(trueSecurity, "No trueSecurity specified");
  if (this.trueSecurity < 0.0) {
    this.security = 0.0;
  } else {
    this.security = parseFloat((Math.floor(trueSecurity * 10) / 10.0).toFixed(1));
  }
}

EmptySolarSystem.prototype.getId = function() {
  return this.id;
};

EmptySolarSystem.prototype.getGalaxyId = function() {
  return this.galaxyId;
};

EmptySolarSystem.prototype.getRegionId = function() {
  return this.regionId;
};

EmptySolarSystem.prototype.getConstellationId = function() {
  return this.constellationId;
};

EmptySolarSystem.prototype.getLocation = function() {
  return this.location;
};

EmptySolarSystem.prototype.getSecurityValue = function() {
  return this.security;
};

EmptySolarSystem.prototype.getJumps = function(jumpType) {
  return [];
};

EmptySolarSystem.prototype.getCosts = function() {
  return [];
};

module.exports = EmptySolarSystem;
