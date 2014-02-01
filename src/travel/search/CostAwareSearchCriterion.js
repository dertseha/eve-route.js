"use strict";

/**
 * A search criterion that continues searches only if the given path is cheaper
 * than the current results.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Function(everoute.travel.rules.TravelRule)} rule the rule by which to compare costs
 * @memberof everoute.travel.search
 */
function CostAwareSearchCriterion(rule) {

  this.isDesired = function(path) {
    return true;
  };

  this.shouldSearchContinueWith = function(path, results) {
    var costSum = path.getCostSum();

    return results.reduce(function(isCheaper, result) {
      return isCheaper && (rule.compare(costSum, result.getCostSum()) < 0);
    }, true);
  };
}

module.exports = CostAwareSearchCriterion;
