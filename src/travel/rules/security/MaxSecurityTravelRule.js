"use strict";

var statics = require("./statics");

/**
 * The rule considers all security value costs that are from a security value
 * below the limit to be equal. The sum of all costs above or equal the limit
 * value is compared.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Number} limit the inclusive limit
 * @memberof everoute.travel.rules
 */
function MaxSecurityTravelRule(limit) {

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, limit, 1.0);
    var valueB = statics.sumSecurityCosts(sumB, limit, 1.0);

    return valueA - valueB;
  };
}

module.exports = MaxSecurityTravelRule;
