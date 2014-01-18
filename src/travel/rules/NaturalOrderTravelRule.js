"use strict";

/**
 * The rule compares costs according to their natural order. Lower values
 * are considered better than higher values.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {everoute.travel.TravelCost} nullCost the default cost value.
 * @memberof everoute.travel.rules
 */
function NaturalOrderTravelRule(nullCost) {

  this.compare = function(sumA, sumB) {
    return sumA.getCost(nullCost).getValue() - sumB.getCost(nullCost).getValue();
  };
}

module.exports = NaturalOrderTravelRule;
