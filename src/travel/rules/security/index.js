"use strict";

/**
 * This namespace contains helper regarding the rules about security.
 *
 * @namespace security
 * @memberof everoute.travel.rules
 */

/**
 * The type identification used for minimum security cost: "minSecurity".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.security
 */
var COST_TYPE_MIN = "minSecurity";

/**
 * The type identification used for maximum security cost: "maxSecurity".
 *
 * @type {String}
 * @const
 * @memberof everoute.travel.rules.security
 */
var COST_TYPE_MAX = "maxSecurity";

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

    // TODO!
  });
};

/**
 * Returns a rule that prefers a path that has at least the given limit as the
 * minimum security value.
 *
 * @param {Number} limit the inclusive minimum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMinRule = function(limit) {
  // TODO!
};

/**
 * Returns a rule that prefers a path that has a maximum security value below
 * the given limit.
 *
 * @param {Number} limit the exclusive maximum value a path should have.
 * @return {everoute.travel.rules.TravelRule} The rule intance.
 * @memberof everoute.travel.rules.security
 */
var getMaxRule = function(limit) {
  // TODO!
};

module.exports = {
  COST_TYPE_MAX: COST_TYPE_MAX,
  COST_TYPE_MIN: COST_TYPE_MIN,
  extendUniverse: extendUniverse,
  getMaxRule: getMaxRule,
  getMinRule: getMinRule
};
