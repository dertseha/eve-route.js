"use strict";

/**
 * This interface represents a rule about travelling. It compares cost sums
 * to provide decision support.
 *
 * @class
 * @interface
 * @memberof everoute.travel
 */
function TravelRule() {

}

/**
 * Compares the two given sums.
 *
 * @param {everoute.travel.TravelCostSum} sumA the first cost sum
 * @param {everoute.travel.TravelCostSum} sumB the second cost sum
 * @return {Number} The comparison result. <0: A is worse than B, >0 A is better than B, 0 if equal.
 * @memberof! everoute.travel.TravelRule.prototype
 */
TravelRule.prototype.compare = function(sumA, sumB) {
  throw new Error("Interface Implementation");
};
