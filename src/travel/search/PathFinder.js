"use strict";

/**
 * A path finder uses a travel capability to search from a starting path one or
 * more paths to other destinations.
 * A search criterion determines whether a found path should be reported to a
 * collector and whether the search should continue with a found path.
 *
 * Since the search might take longer time, it is realized with a queue that
 * is processed one candidate at a time. The user is in control when and how
 * often to continue the search.
 *
 * Note that as long as the travel capability returns new results for any of
 * the found paths, this finder will continue to search. The search criterion
 * only governs whether a specific path is worth continuing.
 * The finder is used best in combination with the OptimizingTravelCapability.
 *
 * The start will also be notified to the criterion and the collector, to enable
 * 'blind' searches that also match the start system.
 *
 * @constructor
 * @param {everoute.travel.Path} start The start for the search.
 * @param {everoute.travel.capabilities.TravelCapability} capability the capability to use for advancing.
 * @param {everoute.travel.search.SearchCriterion} criterion The criterion by which to determine results.
 * @param {everoute.travel.search.PathSearchResultCollector} collector The collector for any found paths.
 * @memberof everoute.travel.search
 */
function PathFinder(start, capability, criterion, collector) {

  var candidates = [];

  function continueWithStart() {
    continueFunction = continueWithCandidate;
    processNewCandidate(start);
    continueFunction();
  }

  var continueFunction = continueWithStart;

  /**
   * Continues the search. This method should be called until it returned false.
   *
   * @return {Boolean} false if the search has completed and no more possibilities exist.
   */
  this.continueSearch = function() {
    continueFunction();

    return candidates.length !== 0;
  };

  function continueWithCandidate() {
    var nextPaths;

    if (candidates.length > 0) {
      nextPaths = capability.getNextPaths(candidates.shift());
      nextPaths.forEach(processNewCandidate);
    }
  }

  function processNewCandidate(path) {
    if (criterion.isDesired(path)) {
      collector.collect(path);
    }
    if (criterion.shouldSearchContinueWith(path, collector.getResults())) {
      candidates.push(path);
    }
  }
}

module.exports = PathFinder;
