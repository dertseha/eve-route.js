"use strict";

var util = require("../../../util");
var jumpDistance = require("../../rules/jumpDistance");

var JumpDriveTravelCapability = require("./JumpDriveTravelCapability");

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
var JUMP_TYPE = JumpDriveTravelCapability.JUMP_TYPE;

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
 * @return {Boolean} true if the given system is a high sec system
 */
var isHighSecSystem = function(extension) {
  return extension.getSecurityValue() >= 0.5;
};

/**
 * Extends the given universe builder with jump drive jumps according to game rules.
 * Jumps will only be possible in New Eden (Galaxy ID 9) and only be into non-high-sec systems.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @param {Number} [limitLy] Optional limit of jumps, in light years
 * @memberof everoute.travel.capabilities.jumpDrive
 */
var extendUniverse = function(builder, limitLy) {
  var usedLimit = limitLy || DISTANCE_LIMIT_LY;
  var solarSystemIds = builder.getSolarSystemIds();
  var highSecSystems = [];
  var nonHighSecSystems = [];

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);

    if (isNewEdenSystem(extension)) {
      if (isHighSecSystem(extension)) {
        highSecSystems.push(extension);
      } else {
        nonHighSecSystems.push(extension);
      }
    }
  });

  function createJumpsFromHighSec(source) {
    nonHighSecSystems.forEach(function(destination) {
      var distance = source.getLocation().distanceTo(destination.getLocation()) / util.constants.METERS_PER_LY;

      if (distance <= usedLimit) {
        source.addJump(JUMP_TYPE, destination.getId()).addCost(jumpDistance.getCost(distance));
      }
    });
  }

  function createJumpsBetween(source, startIndex) {
    var limit = nonHighSecSystems.length;
    var destination;
    var distance;
    var cost;
    var i;

    for (i = startIndex; i < limit; i++) {
      destination = nonHighSecSystems[i];
      distance = source.getLocation().distanceTo(destination.getLocation()) / util.constants.METERS_PER_LY;
      if (distance <= usedLimit) {
        cost = jumpDistance.getCost(distance);
        destination.addJump(JUMP_TYPE, source.getId()).addCost(cost);
        source.addJump(JUMP_TYPE, destination.getId()).addCost(cost);
      }
    }
  }

  highSecSystems.forEach(function(source) {
    createJumpsFromHighSec(source);
  });
  nonHighSecSystems.forEach(function(source, index) {
    createJumpsBetween(source, index + 1);
  });
};

module.exports = {
  JUMP_TYPE: JUMP_TYPE,
  DISTANCE_LIMIT_LY: DISTANCE_LIMIT_LY,

  JumpDriveTravelCapability: JumpDriveTravelCapability,

  extendUniverse: extendUniverse
};
