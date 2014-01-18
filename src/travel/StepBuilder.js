"use strict";

var AnyLocation = require("./AnyLocation");
var Step = require("./Step");

/**
 * This builder helps creating steps, using common defaults where possible.
 *
 * @constructor
 * @param {Number} solarSystemId The ID of the solar system in which this step ends
 * @memberof everoute.travel
 */
function StepBuilder(solarSystemId) {

  var to = new AnyLocation();
  var enterCosts = [];
  var continueCosts = [];

  /**
   * Builds a step instance with the current contained data.
   * @return {everoute.travel.Step} The built step instance.
   */
  this.build = function() {
    return new Step(solarSystemId, to, enterCosts, continueCosts);
  };

  /**
   * The location in the solar system where the step is completing.
   * Defaults to AnyLocation.
   *
   * @param  {everoute.travel.Location} location the destination location
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.to = function(location) {
    to = location;

    return this;
  };

  /**
   * Sets the enter costs for this step. Defaults to empty array.
   *
   * @param {Array.<everoute.travel.TravelCost>} costs the enter costs.
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.withEnterCosts = function(costs) {
    enterCosts = costs.slice(0);

    return this;
  };

  /**
   * Sets the continue costs for this step. Defaults to empty array.
   *
   * @param {Array.<everoute.travel.TravelCost>} costs the continue costs.
   * @return {everoute.travel.StepBuilder} this instance
   */
  this.withContinueCosts = function(costs) {
    continueCosts = costs.slice(0);

    return this;
  };
}

module.exports = StepBuilder;
