"use strict";

/**
 * This class collects travel costs and can add costs up to new sums.
 *
 * @constructor
 * @memberof everoute.travel
 * @param {Array.<everoute.travel.TravelCost>} initCosts initial costs
 */
function TravelCostSum(initCosts) {
  var costs = {};

  initCosts.forEach(function(cost) {
    var type = cost.getType();

    if (costs.hasOwnProperty(type)) {
      costs[type] = cost.join(costs[type]);
    } else {
      costs[type] = cost;
    }
  });

  this.costs = costs;
}

/**
 * Returns a contained cost of the same type as given cost or the given cost
 * if this type is unknown.
 *
 * @param {everoute.travel.TravelCost} nullCost The cost to default to
 * @return {everoute.travel.TravelCost} The corresponing cost
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.getCost = function(nullCost) {
  return this.costs[nullCost.getType()] || nullCost;
};

/**
 * @return {Array.<everoute.travel.TravelCost>} Array of all costs in this sum.
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.getTotal = function() {
  var result = [];
  var key;

  for (key in this.costs) {
    if (this.costs.hasOwnProperty(key)) {
      result.push(this.costs[key]);
    }
  }

  return result;
};

/**
 * Adds an array of costs to the current sum, returning a new sum.
 *
 * @param {Array.<everoute.travel.TravelCost>} costs Array of costs to add.
 * @memberof! everoute.travel.TravelCostSum.prototype
 */
TravelCostSum.prototype.add = function(costs) {
  return new TravelCostSum(this.getTotal().concat(costs));
};

module.exports = TravelCostSum;
