"use strict";

/**
 * This capability combines a set of other capabilities. The result is the
 * combination of all contained capabilities.
 *
 * @constructor
 * @implements everoute.travel.capabilities.TravelCapability
 * @extends everoute.travel.capabilities.TravelCapability
 * @param {Array.<everoute.travel.capabilies.TravelCapability>} capabilities The capabilities to combine.
 * @memberof everoute.travel.capabilities
 */
function CombiningTravelCapability(capabilities) {

  this.getNextPaths = function(origin) {
    var result = [];

    capabilities.forEach(function(capability) {
      result = result.concat(capability.getNextPaths(origin));
    });

    return result;
  };
}

module.exports = CombiningTravelCapability;
