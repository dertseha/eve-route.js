"use strict";

/**
 * This namespace contains utility helper for the library.
 *
 * @namespace util
 * @memberof everoute
 */

/**
 * A null function (no operation)
 * @memberof everoute.util
 */
var noop = function() {

};

var METERS_PER_AU = 149597870700;

var constants = {
  GALAXY_ID_NEW_EDEN: 9,
  GALAXY_ID_W_SPACE: 9000001,
  METERS_PER_AU: METERS_PER_AU,
  METERS_PER_LY: METERS_PER_AU * 63241
};

module.exports = {
  DefaultRandomizer: require("./DefaultRandomizer"),

  constants: constants,

  noop: noop
};
