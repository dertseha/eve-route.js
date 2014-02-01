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
  var integerLimit = limit * 10;

  this.compare = function(sumA, sumB) {
    var valueA = statics.sumSecurityCosts(sumA, integerLimit, 10);
    var valueB = statics.sumSecurityCosts(sumB, integerLimit, 10);

    return valueA - valueB;
  };
}

module.exports = MaxSecurityTravelRule;
