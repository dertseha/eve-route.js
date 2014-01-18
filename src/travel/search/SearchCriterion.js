"use strict";

/**
 * This interface represents a criterion for a search.
 *
 * @class
 * @interface
 * @memberof everoute.travel.search
 */
function SearchCriterion() {

}

/**
 * Checks whether the found path is a desired one.
 *
 * @param {everoute.travel.Path} path a path that has been found.
 * @return {Boolean} True if the given path is a desired result.
 * @memberof! everoute.travel.search.SearchCriterion.prototype
 */
SearchCriterion.prototype.isDesired = function(path) {
  throw new Error("Interface Implementation");
};

/**
 * Provides information whether the search should continue using the given path.
 *
 * @param {everoute.travel.Path} path a path that is to be used as new source.
 * @return {Boolean} True if the search should continue with the given path.
 * @memberof! everoute.travel.search.SearchCriterion.prototype
 */
SearchCriterion.prototype.shouldSearchContinueWith = function(path) {
  throw new Error("Interface Implementation");
};
