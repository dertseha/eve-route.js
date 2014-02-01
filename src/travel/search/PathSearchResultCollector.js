"use strict";

/**
 * This interface is for collectors of search results.
 *
 * @class
 * @interface
 * @memberof everoute.travel.search
 */
function PathSearchResultCollector() {

}

/**
 * Called by the PathFinder about a result that was was determined to be the
 * best so far. The result is the best for its current search critera.
 *
 * @param {everoute.travel.Path} result The result.
 * @memberof! everoute.travel.search.PathSearchResultCollector.prototype
 */
PathSearchResultCollector.prototype.collect = function(result) {
  throw new Error("Interface Implementation");
};

/**
 * Returns a list of results that are currently considered to be worthwhile by
 * the user. Typically, this is the array of collected paths that were
 * the best for their respective destination key so far.
 *
 * @return {Array.<everoute.travel.Path>} Array of results currently collected.
 */
PathSearchResultCollector.prototype.getResults = function() {
  throw new Error("Interface Implementation");
};
