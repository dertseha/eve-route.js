"use strict";

/**
 * A step is one entry in a travel path. It only contains information about
 * the completed step - i.e., the destination information.
 *
 * @constructor
 * @memberof everoute.travel
 */
function Step(solarSystemId, location, costs) {
  this.solarSystemId = solarSystemId;
  this.location = location;
  this.costs = costs.slice(0);
}

/**
 * @return {Number} The ID of the solar system this step ended.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getSolarSystemId = function() {
  return this.solarSystemId;
};

/**
 * @return {everoute.travel.Location} The location within the solar system.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getLocation = function() {
  return this.location;
};

/**
 * @return {Array.<everoute.travel.TravelCost>} The costs involved in this step.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getCosts = function() {
  return this.costs.slice(0);
};

module.exports = Step;
