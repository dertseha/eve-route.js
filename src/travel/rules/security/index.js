"use strict";

var statics = require("./statics");
var MaxSecurityTravelRule = require("./MaxSecurityTravelRule");
var MinSecurityTravelRule = require("./MinSecurityTravelRule");

/**
 * This namespace contains helper regarding the rules about security.
 *
 * @namespace security
 * @memberof everoute.travel.rules
 */

/**
 * Extends the universe by adding security cost to all solar systems.
 * This method should be called only once per universe as it would add the same
 * cost another time to existing ones.
 *
 * @param {everoute.universe.UniverseBuilder} builder The builder for extension.
 * @memberof everoute.travel.rules.security
 */
var extendUniverse = function(builder) {
  var solarSystemIds = builder.getSolarSystemIds();

  solarSystemIds.forEach(function(id) {
    var extension = builder.extendSolarSystem(id);
    var security = extension.getSecurityValue();

    extension.addCost(statics.getTravelCost(security, 1));
  });
};

/**
 * Returns a rule that prefers a path that has at least the given limit as the
 * minimum security value. Reasonable values for limit are [0.1 .. 0.5]
 *
 * @param {Number} limit the inclusive minimum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMinRule = function(limit) {
  return new MinSecurityTravelRule(limit);
};

/**
 * Returns a rule that prefers a path that has a maximum security value below
 * the given limit. Reasonable values for limit are [0.5 .. 1.0]
 *
 * @param {Number} limit the exclusive maximum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMaxRule = function(limit) {
  return new MaxSecurityTravelRule(limit);
};

module.exports = {
  extendUniverse: extendUniverse,
  getMaxRule: getMaxRule,
  getMinRule: getMinRule,
  getTravelCost: statics.getTravelCost,
  getTravelCostType: statics.getTravelCostType
};
