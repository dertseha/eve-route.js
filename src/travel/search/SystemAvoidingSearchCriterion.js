"use strict";

/**
 * A search criterion that aborts searches if they run across a specified
 * solar system.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Array.<Integer>} ignored the list of ignored solar systems
 * @memberof everoute.travel.search
 */
function SystemAvoidingSearchCriterion(ignored) {

  var ignoredIds = ignored.slice(0);

  this.isDesired = function(path) {
    return true;
  };

  this.shouldSearchContinueWith = function(path, results) {
    return path.isStart() || (ignoredIds.indexOf(path.getStep().getSolarSystemId()) < 0);
  };
}

module.exports = SystemAvoidingSearchCriterion;
