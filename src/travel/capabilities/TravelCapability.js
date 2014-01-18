"use strict";

/**
 * A travel capability produces a list of destinations from a starting point.
 *
 * @class
 * @interface
 * @memberof everoute.travel.capabilities
 */
function TravelCapability() {

}

/**
 * Calculates and returns a list of possible next steps from given path.
 *
 * @param  {everoute.travel.Path} origin The start path from which to provide further options.
 * @return {Array.<everoute.travel.Path>} List of possible further paths.
 * @memberof! everoute.travel.capabilities.TravelCapability.prototype
 */
TravelCapability.prototype.getNextPaths = function(origin) {
  throw new Error("Interface Implementation");
};
