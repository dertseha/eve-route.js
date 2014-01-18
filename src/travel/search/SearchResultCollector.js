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
 * Called by the PathFinder about a path that was was determined to be the
 * best so far. The path is the best for its current destination key as per
 * search critera.
 *
 * @param {everoute.travel.Path} path a path that has been found.
 * @memberof! everoute.travel.search.SearchResultCollector.prototype
 */
SearchResultCollector.prototype.collect = function(path) {
  throw new Error("Interface Implementation");
};
