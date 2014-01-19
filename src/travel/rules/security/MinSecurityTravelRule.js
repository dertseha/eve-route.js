"use strict";

var statics = require("./statics");

/**
 * The rule considers all security value costs that are from a security value
 * equal or above the limit to be equal. The sum of all costs below the limit
 * value is compared.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Number} limit the inclusive limit
 * @memberof everoute.travel.rules
 */
function MinSecurityTravelRule(limit) {

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, 0.0, limit - 0.1);
    var valueB = statics.sumSecurityCosts(sumB, 0.0, limit - 0.1);

    return valueA - valueB;
  };
}

module.exports = MinSecurityTravelRule;
