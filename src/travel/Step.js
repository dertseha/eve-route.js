"use strict";

/**
 * A step is one entry in a travel path. It only contains information about
 * the completed step - i.e., the destination information.
 *
 * 'Continue' costs are those that are necessary if this step is only an
 * intermediary step in a journey. For example, the security status of a system
 * does not contribute to the cost of the path if the system is the last one
 * (the destination).
 *
 * The user does not need to create an instance directly and should use the
 * StepBuilder instead.
 *
 * @constructor
 * @param {Number} solarSystemId The ID of the solar system in which this step ends
 * @param {everoute.travel.Location} location the location where the step ends
 * @param {Array.<everoute.travel.TravelCost>} enterCosts costs necessary to do this step
 * @param {Array.<everoute.travel.TravelCost>} continueCosts costs necessary to continue the journey
 * @memberof everoute.travel
 */
function Step(solarSystemId, location, enterCosts, continueCosts) {
  this.solarSystemId = solarSystemId;
  this.location = location;
  this.enterCosts = enterCosts.slice(0);
  this.continueCosts = continueCosts.slice(0);
}

/**
 * @return {everoute.travel.Step} A step that is a copy of this, without costs
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.asFirstStep = function() {
  return new Step(this.solarSystemId, this.location, [], []);
};

/**
 * @return {String} A key that identifies this destination location
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getKey = function() {
  return this.solarSystemId.toString() + "@" + this.location.toString();
};

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
 * @return {Array.<everoute.travel.TravelCost>} The costs involved in reaching this step.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getEnterCosts = function() {
  return this.enterCosts.slice(0);
};

/**
 * @return {Array.<everoute.travel.TravelCost>} The costs necessary to continue the journey.
 * @memberof! everoute.travel.Step.prototype
 */
Step.prototype.getContinueCosts = function() {
  return this.continueCosts.slice(0);
};

module.exports = Step;
