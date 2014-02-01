"use strict";

var AddingTravelCost = require("../../AddingTravelCost");

/**
 * Returns the travel cost type identifier for given security value. This
 * method is meant for the 'visible' security value in the range of 0.0 .. 1.0
 * with 0.1 increments. For example, a value of 0.3 will return "security03".
 *
 * @param {Number} security the security value
 * @return {String} the travel cost type identifier for given security value.
 * @memberof! everoute.travel.rules.security
 */
var getTravelCostType = function(security) {
  return "security" + security.toFixed(1).replace(".", "");
};

/**
 * Returns a travel cost representing given security, having the given value.
 *
 * @param {Number} security The security value.
 * @param {Number} value The initial value.
 * @return {everoute.travel.TravelCost} The travel cost representing the security value.
 * @memberof! everoute.travel.rules.security
 */
var getTravelCost = function(security, value) {
  return new AddingTravelCost(getTravelCostType(security), value);
};

var nullCosts = {};

(function initNullCosts() {
  var security;
  var cost;

  for (security = 0; security <= 10; security++) {
    cost = getTravelCost(security / 10, 0);
    nullCosts[cost.getType()] = cost;
  }
})();

/**
 * Returns the sum of all security costs between the two given security limits.
 * The limits are integer values (0..10) to avoid rounding errors.
 *
 * @param {everoute.travel.TravelCostSum} costSum The cost sum from which to extract costs.
 * @param {Number} from Security value, from which to check (inclusive).
 * @param {Number} to Security value, to which to check (inclusive).
 * @return {Number} Amount of all costs in the range.
 * @private
 */
var sumSecurityCosts = function(costSum, from, to) {
  var result = 0;
  var security;
  var nullCost;

  for (security = from; security <= to; security++) {
    nullCost = nullCosts[getTravelCostType(security / 10)];
    result += costSum.getCost(nullCost).getValue();
  }

  return result;
};

module.exports = {
  getTravelCost: getTravelCost,
  getTravelCostType: getTravelCostType,

  sumSecurityCosts: sumSecurityCosts
};
