"use strict";

/**
 * This interface is for a randomizer.
 *
 * @class
 * @interface
 * @memberof everoute.util
 */
function Randomizer() {

}

/**
 * Returns a random value that can be used as an index.
 *
 * @param {Number} limit The upper limit (i.e., the length of the array)
 * @return {Number} an integer index in the range of 0 .. limit (excluding)
 * @memberof! everoute.util.Randomizer
 */
Randomizer.prototype.getIndex = function(limit) {
  throw new Error("Interface Implementation");
};
