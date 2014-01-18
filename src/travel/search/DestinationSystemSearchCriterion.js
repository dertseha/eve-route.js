"use strict";

/**
 * A search criterion that looks for a specific system and stops searches
 * when this system has been reached.
 *
 * @constructor
 * @implements everoute.travel.search.SearchCriterion
 * @extends everoute.travel.search.SearchCriterion
 * @param {Number} systemId The ID of the solar system to look for
 * @memberof everoute.travel.search
 */
function DestinationSystemSearchCriterion(systemId) {

  this.isDesired = function(path) {
    return path.getStep().getSolarSystemId() === systemId;
  };

  this.shouldSearchContinueWith = function(path) {
    return path.getStep().getSolarSystemId() !== systemId;
  };
}

module.exports = DestinationSystemSearchCriterion;
