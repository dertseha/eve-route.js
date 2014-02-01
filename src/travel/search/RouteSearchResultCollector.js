"use strict";

/**
 * This interface is for collectors of route search results.
 *
 * @class
 * @interface
 * @memberof everoute.travel.search
 */
function RouteSearchResultCollector() {

}

/**
 * Called by the RouteFinder about a result that was was determined to be the
 * best so far. The result is the best for its current search critera.
 *
 * @param {everoute.travel.search.Route} result The result.
 * @memberof! everoute.travel.search.RouteSearchResultCollector.prototype
 */
RouteSearchResultCollector.prototype.collect = function(result) {
  throw new Error("Interface Implementation");
};
