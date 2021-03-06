"use strict";

/**
 * The ruleset is a list of TravelRules and provides a combined comparison
 * result. The contained rules are used for comparison until one rule returns
 * a difference.
 *
 * @constructor
 * @implements {everoute.travel.rules.TravelRule}
 * @extends {everoute.travel.rules.TravelRule}
 * @param {Array.<everoute.travel.rules.TravelRule>} rules the rules to use
 * @memberof everoute.travel.rules
 */
function TravelRuleset(rules) {
  this.rules = rules.slice(0);
}

TravelRuleset.prototype.compare = function(sumA, sumB) {
  var amount = this.rules.length;
  var result = 0;
  var i;

  for (i = 0; result === 0 && (i < amount); i++) {
    result = this.rules[i].compare(sumA, sumB);
  }

  return result;
};

module.exports = TravelRuleset;
