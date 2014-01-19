"use strict";

var AddingTravelCost = require("../../AddingTravelCost");
var NaturalOrderTravelRule = require("../NaturalOrderTravelRule");

/**
 * This namespace contains helper regarding the transit count rule. This
 * rule is used to determine the length of a path.
 * The term "transit count" is technically more correct as the corresponding
 * cost is only added for systems that are neither source nor destination
 * systems.
 *
 * @namespace transitCount
 * @memberof everoute.travel.rules
 */

/**
 * The type identification used for cost: "transitCount".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.transitCount
 */
var COST_TYPE = "transitCount";

/**
 * Extends the universe by adding a transit count cost to all solar systems.
 * This method should be called only once per universe as it would add the same
 * cost another time to existing ones.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @memberof everoute.travel.rules.transitCount
 */
var extendUniverse = function(builder) {
  var solarSystemIds = builder.getSolarSystemIds();

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);

    extension.addCost(new AddingTravelCost(COST_TYPE, 1));
  });
};

/**
 * Returns a rule that will search for the lowest transit count - in effect,
 * the shortest path between a source and a destination.
 *
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.transitCount
 */
var getRule = function() {
  var nullCost = new AddingTravelCost(COST_TYPE, 0);

  return new NaturalOrderTravelRule(nullCost);
};

module.exports = {
  COST_TYPE: COST_TYPE,
  extendUniverse: extendUniverse,
  getRule: getRule
};
