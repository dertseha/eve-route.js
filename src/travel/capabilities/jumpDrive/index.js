"use strict";

var util = require("../../../util");

/**
 * This namespace contains helper regarding the jump drive travel capability.
 *
 * @namespace jumpDrive
 * @memberof everoute.travel.capabilities
 */

/**
 * The type identification for the jumps: "jumpDrive".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var JUMP_TYPE = "jumpDrive";

/**
 * The maximum distance one can jump with a jump drive. As per http://wiki.eveonline.com/en/wiki/Jump_drive, this is
 * based on a carrier (6.5) times 2.5 at maximum skill level - rounded up for paranoia.
 *
 * @type {Number}
 * @const
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var DISTANCE_LIMIT_LY = 17.0;

/**
 * @param {everoute.universe.SolarSystemExtension} extension the solar system extension to check
 * @return {Boolean} true if the given system is from the New Eden galaxy
 */
var isNewEdenSystem = function(extension) {
  return extension.getGalaxyId() === util.constants.GALAXY_ID_NEW_EDEN;
};

/**
 * @param {everoute.universe.SolarSystemExtension} extension the solar system extension to check
 * @return {Boolean} true if the given system is not a high sec system
 */
var isNotHighSecSystem = function(extension) {
  return extension.getSecurityValue() < 0.5;
};

/**
 * Extends the given universe builder with jump drive jumps according to game rules.
 * Jumps will only be possible in New Eden (Galaxy ID 9) and only be into non-high-sec systems.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var extendUniverse = function(builder) {
  var solarSystemIds = builder.getSolarSystemIds();
  var solarSystems = solarSystemIds.length;

  function checkJump(extensionFrom, extensionTo) {
    var distance;

    if (isNotHighSecSystem(extensionTo)) {
      distance = extensionFrom.getLocation().distanceTo(extensionTo.getLocation()) / util.constants.METERS_PER_LY;
      if (distance <= DISTANCE_LIMIT_LY) {
        extensionFrom.addJump(JUMP_TYPE, extensionTo.getId());
      }
    }
  }

  function checkJumpsFollowing(extension, index) {
    var i;
    var extension2;

    for (i = index + 1; i < solarSystems; i++) {
      extension2 = builder.extendSolarSystem(solarSystemIds[i]);

      if (isNewEdenSystem(extension2)) {
        checkJump(extension, extension2);
        checkJump(extension2, extension);
      }
    }
  }

  solarSystemIds.forEach(function(id, index) {
    var extension = builder.extendSolarSystem(id);

    if (isNewEdenSystem(extension)) {
      checkJumpsFollowing(extension, index);
    }
  });
};

module.exports = {
  JUMP_TYPE: JUMP_TYPE,
  DISTANCE_LIMIT_LY: DISTANCE_LIMIT_LY,

  extendUniverse: extendUniverse
};
