"use strict";

/**
 * This interface is for collectors of search results.
 *
 * @class
 * @interface
 * @memberof everoute.travel.search
 */
function SearchResultCollector() {

}

/**
 * Called by the PathFinder or the RouteFinder about a result that was was
 * determined to be the best so far. The result is the best for its current
 * search critera.
 *
 * @param {ResultType} result The result.
 * @template ResultType
 * @memberof! everoute.travel.search.SearchResultCollector.prototype
 */
SearchResultCollector.prototype.collect = function(result) {
  throw new Error("Interface Implementation");
};
