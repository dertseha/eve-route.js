"use strict";

/**
 * A search criterion that combines a list of other criteria.
 * It desires only paths that all criteria desire and lets the search continue
 * only with paths on which all criteria agree.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Array.<everoute.travel.search.SearchCriterion>} criteria A list of criteria to combine
 * @memberof everoute.travel.search
 */
function CombiningSearchCriterion(criteria) {

  this.isDesired = function(path) {
    var result = false;

    if (criteria.length > 0) {
      result = criteria.reduce(function(desired, criterion) {
        return desired && criterion.isDesired(path);
      }, true);
    }

    return result;
  };

  this.shouldSearchContinueWith = function(path, results) {
    var result = false;

    if (criteria.length > 0) {
      result = criteria.reduce(function(desired, criterion) {
        return desired && criterion.shouldSearchContinueWith(path, results);
      }, true);
    }

    return result;
  };
}

module.exports = CombiningSearchCriterion;
