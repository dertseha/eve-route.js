"use strict";

/**
 * This randomizer uses Math.rand()
 *
 * @constructor
 * @implements everoute.util.Randomizer
 * @extends everoute.util.Randomizer
 * @memberof everoute.util
 */
function DefaultRandomizer() {

}

DefaultRandomizer.prototype.getIndex = function(limit) {
  var result = Math.floor(Math.random() * limit);

  /*
   * As per documentation on https://developer.mozilla.org , there is a rare
   * case where Math.random() returns 1.0 .
   */
  if ((result >= limit) && (limit > 0)) {
    result = limit - 1;
  }

  return result;
};

module.exports = DefaultRandomizer;
