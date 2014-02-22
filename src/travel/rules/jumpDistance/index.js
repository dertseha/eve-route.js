"use strict";

var AddingTravelCost = require("../../AddingTravelCost");
var NaturalOrderTravelRule = require("../NaturalOrderTravelRule");

/**
 * This namespace contains helper regarding the jump distance rule. This
 * rule is used to determine the distance of jump drive jumps.
 *
 * @namespace jumpDistance
 * @memberof everoute.travel.rules
 */

/**
 * The type identification used for cost: "jumpDistance".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.jumpDistance
 */
var COST_TYPE = "jumpDistance";

/**
 * @param {Number} lightYears The distance in light years
 * @return {everoute.travel.TravelCost} the cost representing the distance
 * @memberof everoute.travel.rules.jumpDistance
 */
var getCost = function(lightYears) {
  return new AddingTravelCost(COST_TYPE, lightYears);
};

/**
 * Returns a rule that will search for the lowest jump distance - in effect,
 * the path between a source and a destination that requires the least amount
 * of jump fuel.
 *
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.jumpDistance
 */
var getRule = function() {
  return new NaturalOrderTravelRule(getCost(0));
};

module.exports = {
  COST_TYPE: COST_TYPE,
  getCost: getCost,
  getRule: getRule
};
